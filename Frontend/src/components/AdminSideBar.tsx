import { Building, Bed, Settings, BarChart3, Hospital, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { Button } from "./ui/button";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    title: "Overview",
    icon: BarChart3,
    id: "overview",
  },
  {
    title: "Bed Management",
    icon: Bed,
    id: "beds",
  },
  {
    title: "Facilities",
    icon: Building,
    id: "facilities",
  },
  {
    title: "Hospital Info",
    icon: Hospital,
    id: "hospital-info",
  },
];

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Hospital className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Admin Panel</h2>
            <p className="text-sm text-gray-600">St. Mary's Hospital</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
