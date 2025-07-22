
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export interface Feedback {
  id: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  rating: number;
  title: string;
  comment: string;
  category: 'service' | 'quality' | 'delivery' | 'pricing' | 'staff' | 'general';
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: Date;
  response?: string;
  respondedAt?: Date;
  helpful: number;
  notHelpful: number;
}

export function FeedbackSystem() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [response, setResponse] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('ola_feedbacks');
    if (savedFeedbacks) {
      const parsed = JSON.parse(savedFeedbacks);
      const withDates = parsed.map((feedback: any) => ({
        ...feedback,
        createdAt: new Date(feedback.createdAt),
        respondedAt: feedback.respondedAt ? new Date(feedback.respondedAt) : undefined
      }));
      setFeedbacks(withDates);
    } else {
      // Sample data
      const sampleFeedbacks: Feedback[] = [
        {
          id: '1',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          orderId: 'ORD-001',
          rating: 5,
          title: 'Excellent Service!',
          comment: 'Very satisfied with the quality and quick turnaround time. Will definitely use again.',
          category: 'service',
          status: 'new',
          createdAt: new Date('2024-01-15'),
          helpful: 3,
          notHelpful: 0
        },
        {
          id: '2',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@example.com',
          orderId: 'ORD-002',
          rating: 3,
          title: 'Delayed Delivery',
          comment: 'Service was good but delivery was delayed by 2 days. Would appreciate better communication.',
          category: 'delivery',
          status: 'reviewed',
          createdAt: new Date('2024-01-12'),
          response: 'Thank you for your feedback. We apologize for the delay and are working to improve our delivery times.',
          respondedAt: new Date('2024-01-13'),
          helpful: 1,
          notHelpful: 0
        }
      ];
      setFeedbacks(sampleFeedbacks);
    }
  }, []);

  const saveFeedbacks = (updatedFeedbacks: Feedback[]) => {
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('ola_feedbacks', JSON.stringify(updatedFeedbacks));
  };

  const handleResponse = (feedbackId: string) => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    const updatedFeedbacks = feedbacks.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            response, 
            respondedAt: new Date(),
            status: 'resolved' as const
          }
        : feedback
    );
    
    saveFeedbacks(updatedFeedbacks);
    setResponse('');
    setSelectedFeedback(null);
    toast.success('Response sent successfully!');
  };

  const markAsReviewed = (feedbackId: string) => {
    const updatedFeedbacks = feedbacks.map(feedback => 
      feedback.id === feedbackId 
        ? { ...feedback, status: 'reviewed' as const }
        : feedback
    );
    saveFeedbacks(updatedFeedbacks);
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const categoryMatch = filterCategory === 'all' || feedback.category === filterCategory;
    const statusMatch = filterStatus === 'all' || feedback.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: feedbacks.length > 0 
      ? (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100
      : 0
  }));

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= averageRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {feedbacks.filter(f => f.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {feedbacks.filter(f => f.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span>{item.rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-600">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Customer Feedback
            <div className="flex gap-2">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Categories</option>
                <option value="service">Service</option>
                <option value="quality">Quality</option>
                <option value="delivery">Delivery</option>
                <option value="pricing">Pricing</option>
                <option value="staff">Staff</option>
                <option value="general">General</option>
              </select>
              
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFeedbacks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No feedback found</p>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback) => (
                <Card key={feedback.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium">{feedback.customerName}</h4>
                        <p className="text-sm text-gray-600">{feedback.customerEmail}</p>
                        {feedback.orderId && (
                          <p className="text-xs text-gray-500">Order: {feedback.orderId}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {feedback.category}
                      </Badge>
                      <Badge 
                        variant={feedback.status === 'new' ? 'destructive' : 
                                feedback.status === 'reviewed' ? 'secondary' : 'default'}
                      >
                        {feedback.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= feedback.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {feedback.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <h5 className="font-medium mb-1">{feedback.title}</h5>
                    <p className="text-gray-700">{feedback.comment}</p>
                  </div>

                  {feedback.response && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <h6 className="font-medium text-blue-900 mb-1">Our Response:</h6>
                      <p className="text-blue-800">{feedback.response}</p>
                      <span className="text-xs text-blue-600">
                        Responded on {feedback.respondedAt?.toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feedback.helpful}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{feedback.notHelpful}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {feedback.status === 'new' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsReviewed(feedback.id)}
                          >
                            Mark Reviewed
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setSelectedFeedback(feedback)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {selectedFeedback?.id === feedback.id && (
                    <div className="mt-4 p-4 border-t">
                      <Textarea
                        placeholder="Type your response..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={3}
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleResponse(feedback.id)}
                          disabled={!response.trim()}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send Response
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedFeedback(null);
                            setResponse('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
