
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '@/types/reviews';

interface ReviewDisplayProps {
  review: Review;
  onHelpfulClick?: (reviewId: string) => void;
}

export function ReviewDisplay({ review, onHelpfulClick }: ReviewDisplayProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{review.customerName}</span>
              {review.isVerified && (
                <Badge variant="secondary" className="text-xs">
                  Verified Purchase
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
          <Badge variant="outline">{review.serviceType}</Badge>
        </div>

        <h4 className="font-medium mb-2">{review.title}</h4>
        <p className="text-gray-700 mb-4">{review.comment}</p>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onHelpfulClick?.(review.id)}
            className="flex items-center gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            Helpful ({review.helpfulCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
