import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx";
import { 
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
import { useToast } from "../../hooks/use-toast.js"; 

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { toast } = useToast(); // Add this

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
    setIsLoading(true); // Set loading state
    try {
      let response = await adminApi.getDashboard();
      console.log("Dashboard Data:", response);

      setDashboardData(response);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch dashboard data",
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false); // Always set loading to false
    }
  }

  const renderContent = () => {
    // Show loading for all sections if dashboard data is loading
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "beds":
        return <BedManagement onUpdate={updateTimestamp} dashboardData={dashboardData} />;
      case "facilities":
        return <FacilityManagement onUpdate={updateTimestamp} dashboardData={dashboardData} />;
      case "hospital-info":
        return <HospitalInfoForm onUpdate={updateTimestamp} dashboardData={dashboardData} />;
      default:
        if (!dashboardData) {
          return (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">No dashboard data available. Please try refreshing the page.</p>
                <div className="flex justify-center mt-4">
                  <Button onClick={getDashboardData}>Retry</Button>
                </div>
              </CardContent>
            </Card>
          );
        }

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Beds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{dashboardData.totalBeds || 0}</div>
                  <p className="text-sm text-gray-600">Available: {dashboardData.availableBeds || 0}</p>
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
                  <p className="text-sm text-gray-600">Emergency Beds: {dashboardData.emergencyBeds || 0}</p>
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
                  Update Facilities
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
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          hospitalName={dashboardData?.hospitalName || "Loading..."} 
        />
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