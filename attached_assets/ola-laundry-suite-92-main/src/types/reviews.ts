
export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  tenantId: string;
  orderId?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  serviceType: string;
  images?: string[];
  createdAt: Date;
  isVerified: boolean;
  helpfulCount: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
