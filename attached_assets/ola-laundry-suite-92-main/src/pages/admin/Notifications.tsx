
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Notification Manager</h3>
            <p className="text-gray-600 mb-4">
              This is a placeholder for the admin notification system.
            </p>
            <p className="text-gray-500 text-sm">
              In the full implementation, this page will include system-wide notifications,
              tenant alerts, and message broadcasting capabilities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
