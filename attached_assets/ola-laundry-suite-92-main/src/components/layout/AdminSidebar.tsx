
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { 
  Users, 
  Settings,
  Bell,
  Palette,
  CreditCard,
  ToggleLeft,
  BarChart3,
  User,
  Edit,
  Globe
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export function AdminSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === `/admin${path}`;

  const handleEditWebsite = () => {
    // Open the landing page in a new tab for editing
    const editUrl = `${window.location.origin}/?edit=true`;
    window.open(editUrl, '_blank');
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4 px-2">
        <div className="flex justify-center items-center">
          <div className="h-12 w-12 bg-ola-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            O
          </div>
        </div>
        <h1 className="font-bold text-center mt-2 text-lg">Super Admin</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("")}>
                  <Link to="/admin">
                    <BarChart3 />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/tenants")}>
                  <Link to="/admin/tenants">
                    <Users />
                    <span>Tenants</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/tenant-management")}>
                  <Link to="/admin/tenant-management">
                    <ToggleLeft />
                    <span>Tenant Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/payment-options")}>
                  <Link to="/admin/payment-options">
                    <CreditCard />
                    <span>Payment Options</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/customization")}>
                  <Link to="/admin/customization">
                    <Palette />
                    <span>Global Customization</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/notifications")}>
                  <Link to="/admin/notifications">
                    <Bell />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Website Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <Globe />
                    <span>View Website</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleEditWebsite}>
                  <Edit />
                  <span>Edit Website</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/profile")}>
                  <Link to="/admin/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive("/settings")}>
                  <Link to="/admin/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
