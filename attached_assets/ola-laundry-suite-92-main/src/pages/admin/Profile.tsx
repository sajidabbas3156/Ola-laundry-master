
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { AccountInfo } from "@/components/admin/AccountInfo";

export default function AdminProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <p className="text-muted-foreground">Manage your admin account settings</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileForm />
        <PasswordChangeForm />
      </div>
      
      <Separator />
      
      <AccountInfo />
    </div>
  );
}
