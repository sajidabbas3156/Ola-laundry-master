
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ReviewFormProps {
  onReviewSubmit: (review: any) => void;
  orderId?: string;
}

export function ReviewForm({ onReviewSubmit, orderId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !title || !comment || !customerName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const review = {
      id: Date.now().toString(),
      customerId: 'current-customer',
      customerName,
      tenantId: 'current-tenant',
      orderId,
      rating,
      title,
      comment,
      serviceType: 'Wash & Fold',
      createdAt: new Date(),
      isVerified: true,
      helpfulCount: 0
    };

    onReviewSubmit(review);
    toast.success('Review submitted successfully!');
    
    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
    setCustomerName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Review Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Great service!"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Your Review</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
