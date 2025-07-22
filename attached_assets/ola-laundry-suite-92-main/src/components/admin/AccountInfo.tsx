
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function AccountInfo() {
  const { currentUser } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <span>Super Administrator</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Account Type:</span>
          <span>System Admin</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">User ID:</span>
          <span className="font-mono text-sm">{currentUser?.id}</span>
        </div>
      </CardContent>
    </Card>
  );
}
