
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AnalyticsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Analytics</CardTitle>
        <CardDescription>Detailed business insights and reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-gray-500">Analytics insights are available in the Pro and Enterprise plans</p>
          <Button className="mt-4 px-4 py-2 bg-ola-600 text-white rounded-md hover:bg-ola-700 transition-colors">
            Upgrade Your Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
