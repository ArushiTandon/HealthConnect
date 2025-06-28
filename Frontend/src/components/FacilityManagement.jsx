import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Activity, Heart, Stethoscope, Users, Car, Zap, Building } from "lucide-react";
import { adminApi } from "../services/adminApi";
import { useToast } from "../hooks/use-toast";

export function FacilityManagement({ onUpdate, dashboardData }) {
  const [facilities, setFacilities] = useState([
    { id: 'icu', name: 'ICU', available: true, icon: Heart },
    { id: 'emergency', name: 'Emergency Room', available: true, icon: Activity },
    { id: 'dialysis', name: 'Dialysis Center', available: true, icon: Stethoscope },
    { id: 'maternity', name: 'Maternity Ward', available: false, icon: Users },
    { id: 'parking', name: 'Parking Available', available: true, icon: Car },
    { id: 'generator', name: 'Backup Generator', available: true, icon: Zap },
    { id: 'cafeteria', name: 'Cafeteria', available: true, icon: Building },
    { id: 'pharmacy', name: '24/7 Pharmacy', available: false, icon: Building },
  ]);

  const { toast } = useToast();

  // Update facilities based on dashboard data
  useEffect(() => {
    if (dashboardData?.facilityStatus) {
      setFacilities(prev => 
        prev.map(facility => ({
          ...facility,
          available: dashboardData.facilityStatus[facility.id] === 'available'
        }))
      );
    }
  }, [dashboardData]);

  const toggleFacility = async (id) => {
    const facility = facilities.find(f => f.id === id);
    if (!facility) return;

    const newStatus = facility.available ? 'unavailable' : 'available';

    try {
      await adminApi.updateFacilityStatus(id, newStatus);
      
      setFacilities(prev => 
        prev.map(f => 
          f.id === id 
            ? { ...f, available: !f.available }
            : f
        )
      );

      toast({
        title: "Success",
        description: `${facility.name} status updated successfully`,
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating facility:', error);
      toast({
        title: "Error",
        description: "Failed to update facility status",
        variant: "destructive",
      });
    }
  };

  const activeCount = facilities.filter(f => f.available).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Facility Management</h2>
          <p className="text-gray-600">Toggle facility availability and status</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {activeCount} of {facilities.length} Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((facility) => {
          const Icon = facility.icon;
          return (
            <Card key={facility.id} className={`transition-all ${facility.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${facility.available ? 'text-green-600' : 'text-red-600'}`} />
                    <CardTitle className="text-base">{facility.name}</CardTitle>
                  </div>
                  {facility.available ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor={facility.id} className="text-sm font-medium">
                    {facility.available ? 'Available' : 'Unavailable'}
                  </Label>
                  <Switch
                    id={facility.id}
                    checked={facility.available}
                    onCheckedChange={() => toggleFacility(facility.id)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facility Status Summary</CardTitle>
          <CardDescription>Current availability overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-sm text-gray-600">Active Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{facilities.length - activeCount}</div>
              <div className="text-sm text-gray-600">Inactive Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round((activeCount / facilities.length) * 100)}%</div>
              <div className="text-sm text-gray-600">Availability Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{facilities.length}</div>
              <div className="text-sm text-gray-600">Total Facilities</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}