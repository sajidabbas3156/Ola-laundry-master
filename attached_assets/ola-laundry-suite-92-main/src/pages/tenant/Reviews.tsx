
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewDisplay } from '@/components/reviews/ReviewDisplay';
import { Star, TrendingUp, MessageSquare, Award } from 'lucide-react';
import { Review, ReviewStats } from '@/types/reviews';

export default function TenantReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      customerId: 'customer-1',
      customerName: 'Sarah Johnson',
      tenantId: 'current-tenant',
      orderId: 'order-123',
      rating: 5,
      title: 'Excellent service!',
      comment: 'My clothes came back perfectly clean and fresh. The pickup and delivery was right on time. Highly recommend!',
      serviceType: 'Wash & Fold',
      createdAt: new Date('2025-01-15'),
      isVerified: true,
      helpfulCount: 8
    },
    {
      id: '2',
      customerId: 'customer-2',
      customerName: 'Mike Chen',
      tenantId: 'current-tenant',
      rating: 4,
      title: 'Good quality cleaning',
      comment: 'Professional service with good attention to detail. Only minor issue was the delivery time was slightly delayed.',
      serviceType: 'Dry Cleaning',
      createdAt: new Date('2025-01-10'),
      isVerified: true,
      helpfulCount: 3
    }
  ]);

  const [reviewStats] = useState<ReviewStats>({
    averageRating: 4.5,
    totalReviews: 127,
    ratingDistribution: {
      5: 85,
      4: 25,
      3: 12,
      2: 3,
      1: 2
    }
  });

  const handleReviewSubmit = (review: Review) => {
    setReviews([review, ...reviews]);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, helpfulCount: review.helpfulCount + 1 }
        : review
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-2xl font-bold">{reviewStats.averageRating}</p>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{reviewStats.totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">5-Star Reviews</p>
                <p className="text-2xl font-bold">{reviewStats.ratingDistribution[5]}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="all-reviews">
            <TabsList>
              <TabsTrigger value="all-reviews">All Reviews</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>

            <TabsContent value="all-reviews" className="space-y-4 mt-4">
              {reviews.map((review) => (
                <ReviewDisplay 
                  key={review.id} 
                  review={review} 
                  onHelpfulClick={handleHelpfulClick}
                />
              ))}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4 mt-4">
              {reviews
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 5)
                .map((review) => (
                  <ReviewDisplay 
                    key={review.id} 
                    review={review} 
                    onHelpfulClick={handleHelpfulClick}
                  />
                ))}
            </TabsContent>

            <TabsContent value="top-rated" className="space-y-4 mt-4">
              {reviews
                .filter(review => review.rating === 5)
                .map((review) => (
                  <ReviewDisplay 
                    key={review.id} 
                    review={review} 
                    onHelpfulClick={handleHelpfulClick}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ 
                          width: `${(reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] / reviewStats.totalReviews) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ReviewForm onReviewSubmit={handleReviewSubmit} />
        </div>
      </div>
    </div>
  );
}
