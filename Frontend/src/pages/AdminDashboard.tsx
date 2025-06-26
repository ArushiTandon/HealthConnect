import { useState } from "react";
import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Switch } from "../components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { 
//   Sidebar, 
//   SidebarContent, 
//   SidebarGroup, 
//   SidebarGroupContent, 
//   SidebarGroupLabel, 
//   SidebarMenu, 
//   SidebarMenuButton, 
//   SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "../components/ui/sidebar";
import { AdminSidebar } from "../components/AdminSideBar";
import { BedManagement } from "../components/BedManagement";
import { FacilityManagement } from "../components/FacilityManagement";
import { HospitalInfoForm } from "../components/HospitalInfoForm";
import { Calendar, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  const updateTimestamp = () => {
    setLastUpdated(new Date().toLocaleString());
  };

  const renderContent = () => {
    switch (activeSection) {
      case "beds":
        return <BedManagement onUpdate={updateTimestamp} />;
      case "facilities":
        return <FacilityManagement onUpdate={updateTimestamp} />;
      case "hospital-info":
        return <HospitalInfoForm onUpdate={updateTimestamp} />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Beds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">150</div>
                  <p className="text-sm text-gray-600">Available: 45</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">8</div>
                  <p className="text-sm text-gray-600">Out of 10 total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">Active</div>
                  <p className="text-sm text-gray-600">24/7 Available</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={() => setActiveSection("beds")} variant="outline">
                  Update Bed Availability
                </Button>
                <Button onClick={() => setActiveSection("facilities")} variant="outline">
                  Manage Facilities
                </Button>
                <Button onClick={() => setActiveSection("hospital-info")} variant="outline">
                  Update Hospital Info
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <SidebarInset>
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
                  <p className="text-gray-600">Manage your hospital's information and availability</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            </div>
            
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;