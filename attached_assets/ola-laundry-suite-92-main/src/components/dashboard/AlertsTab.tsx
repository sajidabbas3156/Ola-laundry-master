
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AlertsTabProps {
  setActiveTab: (tab: string) => void;
}

export function AlertsTab({ setActiveTab }: AlertsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Business Alerts & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-orange-200 bg-orange-50">
            <h4 className="font-medium text-orange-800 mb-2">Inventory Alert</h4>
            <p className="text-sm text-orange-700">2 items running low on stock</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveTab("inventory")}>
              View Inventory
            </Button>
          </Card>
          
          <Card className="p-4 border-blue-200 bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">Peak Hours</h4>
            <p className="text-sm text-blue-700">Orders peak between 6-8 PM today</p>
          </Card>
          
          <Card className="p-4 border-green-200 bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">Customer Milestone</h4>
            <p className="text-sm text-green-700">3 customers reached loyalty milestones</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveTab("loyalty")}>
              View Loyalty
            </Button>
          </Card>
          
          <Card className="p-4 border-purple-200 bg-purple-50">
            <h4 className="font-medium text-purple-800 mb-2">Feedback Alert</h4>
            <p className="text-sm text-purple-700">2 new customer reviews pending response</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveTab("feedback")}>
              View Feedback
            </Button>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
