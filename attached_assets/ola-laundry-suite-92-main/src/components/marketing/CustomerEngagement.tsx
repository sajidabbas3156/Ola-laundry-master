
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Gift, 
  Star, 
  Users, 
  MessageCircle, 
  Calendar,
  Settings,
  TrendingUp,
  Mail,
  Phone
} from "lucide-react";

export function CustomerEngagement() {
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [referralEnabled, setReferralEnabled] = useState(true);
  const [reviewsEnabled, setReviewsEnabled] = useState(true);

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loyalty Members</p>
              <p className="text-xl font-bold">1,247</p>
              <p className="text-xs text-green-600">+12% this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Gift className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Referrals</p>
              <p className="text-xl font-bold">89</p>
              <p className="text-xs text-green-600">+5% this week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-xl font-bold">4.8</p>
              <p className="text-xs text-green-600">156 reviews</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
              <p className="text-xl font-bold">68%</p>
              <p className="text-xs text-green-600">+3% this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Program */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <CardTitle>Loyalty Program</CardTitle>
            </div>
            <Switch checked={loyaltyEnabled} onCheckedChange={setLoyaltyEnabled} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="points-per-dollar">Points per Dollar Spent</Label>
              <Input id="points-per-dollar" placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redemption-rate">Points to Dollar Ratio</Label>
              <Input id="redemption-rate" placeholder="100:1" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loyalty-tiers">Loyalty Tiers</Label>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className="bg-bronze">Bronze</Badge>
                  <span className="text-sm">0-499 points</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">5% discount</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className="bg-silver">Silver</Badge>
                  <span className="text-sm">500-999 points</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">10% discount</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gold">Gold</Badge>
                  <span className="text-sm">1000+ points</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">15% discount</p>
              </div>
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            Update Loyalty Settings
          </Button>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Referral Program</CardTitle>
            </div>
            <Switch checked={referralEnabled} onCheckedChange={setReferralEnabled} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="referrer-reward">Referrer Reward</Label>
              <Input id="referrer-reward" placeholder="$10 credit" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referee-reward">New Customer Reward</Label>
              <Input id="referee-reward" placeholder="20% off first order" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referral-message">Referral Message Template</Label>
            <Textarea 
              id="referral-message" 
              placeholder="Share the love! Refer a friend and you both save..."
              rows={3}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Recent Referrals</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sarah Johnson → Mike Chen</span>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tom Wilson → Lisa Park</span>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Emma Davis → John Doe</span>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            Update Referral Settings
          </Button>
        </CardContent>
      </Card>

      {/* Review Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <CardTitle>Review Management</CardTitle>
            </div>
            <Switch checked={reviewsEnabled} onCheckedChange={setReviewsEnabled} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="review-request-delay">Request Delay (days)</Label>
              <Input id="review-request-delay" placeholder="3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-platform">Primary Platform</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Google Reviews</option>
                <option>Yelp</option>
                <option>Facebook</option>
                <option>Custom Platform</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="review-request-template">Review Request Template</Label>
            <Textarea 
              id="review-request-template" 
              placeholder="Hi {customer_name}, we hope you loved our service..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Reviews
              </h4>
              <p className="text-2xl font-bold text-green-900">142</p>
              <p className="text-sm text-green-700">This month</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                SMS Reviews
              </h4>
              <p className="text-2xl font-bold text-blue-900">89</p>
              <p className="text-sm text-blue-700">This month</p>
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            Update Review Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
