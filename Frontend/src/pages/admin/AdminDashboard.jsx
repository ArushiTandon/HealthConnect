import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Switch } from "../components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx";
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
} from "../../components/ui/sidebar.jsx";
import { AdminSidebar } from "../../components/AdminSidebar.jsx";
import { BedManagement } from "../../components/BedManagement.jsx";
import { FacilityManagement } from "../../components/FacilityManagement.jsx";
import { HospitalInfoForm } from "../../components/HospitalInfoForm.jsx";
import { Calendar, Clock } from "lucide-react";
import { adminApi } from "../../services/adminApi.js";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  const [dashboardData, setDashboardData] = useState(null);

  
  useEffect(() => {
    // Fetch initial dashboard data
    getDashboardData();
    
    // Update timestamp every minute
    const interval = setInterval(() => {
      updateTimestamp();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const updateTimestamp = () => {
    setLastUpdated(new Date().toLocaleString());
  };

  const getDashboardData = async () => {
    
    try {
      let response = await adminApi.getDashboard();
      console.log("Dashboard Data:", response);

      setDashboardData(response);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
      
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "beds":
        return <BedManagement onUpdate={updateTimestamp} dashboardData={dashboardData} />;
      case "facilities":
        return <FacilityManagement onUpdate={updateTimestamp} />;
      case "hospital-info":
        return <HospitalInfoForm onUpdate={updateTimestamp}  />;
      default:
        if (!dashboardData) return <p>Loading...</p>;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Beds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{dashboardData.totalBeds}</div>
                  <p className="text-sm text-gray-600">Available: {dashboardData.availableBeds}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{dashboardData.facilities?.length || 0}</div>
                  <p className="text-sm text-gray-600">Showing current active services</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Status</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className={`text-3xl font-bold ${dashboardData.metrics?.criticalOccupancy ? 'text-red-600' : 'text-green-600'}`}>
              {dashboardData.metrics?.criticalOccupancy ? 'Critical' : 'Active'}
            </div>
                  <p className="text-sm text-gray-600">Emergency Beds: {dashboardData.emergencyBeds}</p>
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
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} hospitalName={dashboardData?.hospitalName} />
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