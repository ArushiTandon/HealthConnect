import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Activity, Heart, Stethoscope, Users, Car, Zap, Building, Ambulance, Hospital, Shield } from "lucide-react";
import { adminApi } from "../services/adminApi";
import { useToast } from "../hooks/use-toast.js";

export function FacilityManagement({ onUpdate, dashboardData }) {
  // Create a mapping between display names and database keys
  const facilityMapping = {
    'ICU': { dbKey: 'ICU', icon: Heart },
    'Emergency Department': { dbKey: 'Emergency Department', icon: Ambulance },
    'Dialysis': { dbKey: 'Dialysis', icon: Stethoscope },
    'Radiology': { dbKey: 'Radiology', icon: Activity },
    'Blood Bank': { dbKey: 'Blood Bank', icon: Heart },
    'Neurology': { dbKey: 'Neurology', icon: Stethoscope },
    'Pharmacy': { dbKey: 'pharmacy', icon: Building },
    'Maternity': { dbKey: 'maternity', icon: Users },
    // Add more mappings as needed
  };

  const [facilities, setFacilities] = useState([]);
  const { toast } = useToast();

  // Initialize facilities from dashboard data
  useEffect(() => {
    console.log('Dashboard Data:', dashboardData); // Debug log
    
    if (dashboardData?.facilityStatus) {
      console.log('Facility Status:', dashboardData.facilityStatus); // Debug log
      const facilityList = [];
      
      // Create facility list from facilityStatus (this contains all facilities the admin can manage)
      Object.keys(dashboardData.facilityStatus).forEach(facilityKey => {
        // Find the display name and icon for this facility
        let displayName = facilityKey;
        let icon = Building;
        
        // Check if we have a mapping for this facility
        const mappingEntry = Object.entries(facilityMapping).find(
          ([name, mapping]) => mapping.dbKey === facilityKey
        );
        
        if (mappingEntry) {
          displayName = mappingEntry[0];
          icon = mappingEntry[1].icon;
        } else {
          // If no mapping found, try to make a nice display name
          displayName = facilityKey.charAt(0).toUpperCase() + facilityKey.slice(1);
          
          // Assign appropriate icons based on facility name
          const lowerKey = facilityKey.toLowerCase();
          if (lowerKey.includes('icu')) icon = Heart;
          else if (lowerKey.includes('emergency')) icon = Ambulance;
          else if (lowerKey.includes('dialysis')) icon = Stethoscope;
          else if (lowerKey.includes('maternity')) icon = Users;
          else if (lowerKey.includes('pharmacy')) icon = Building;
          else if (lowerKey.includes('neurology')) icon = Stethoscope;
          else if (lowerKey.includes('radiology')) icon = Activity;
        }
        
        facilityList.push({
          id: facilityKey,
          name: displayName,
          available: dashboardData.facilityStatus[facilityKey] === 'Available' || 
                    dashboardData.facilityStatus[facilityKey] === 'available',
          icon: icon
        });
      });

      console.log('Generated Facility List:', facilityList); // Debug log
      setFacilities(facilityList);
    } else {
      // Fallback: If dashboardData is not available, show some default facilities
      console.log('No dashboard data, using fallback facilities');
      const defaultFacilities = [
        { id: 'ICU', name: 'ICU', available: true, icon: Heart },
        { id: 'Emergency Department', name: 'Emergency Department', available: true, icon: Ambulance },
        { id: 'Dialysis', name: 'Dialysis', available: true, icon: Stethoscope },
        { id: 'Neurology', name: 'Neurology', available: true, icon: Stethoscope },
        { id: 'pharmacy', name: 'Pharmacy', available: false, icon: Building },
        { id: 'maternity', name: 'Maternity', available: false, icon: Users },
      ];
      setFacilities(defaultFacilities);
    }
  }, [dashboardData]);

  const toggleFacility = async (facilityId) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return;

    const newStatus = facility.available ? 'Unavailable' : 'Available';

    try {

      await adminApi.updateFacilityStatus(facilityId, newStatus);
      
      setFacilities(prev => 
        prev.map(f => 
          f.id === facilityId 
            ? { ...f, available: !f.available }
            : f
        )
      );

      toast({
        title: "Success",
        description: `${facility.name} status updated successfully`,
      });

      if (onUpdate) onUpdate();
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
              <div className="text-2xl font-bold text-blue-600">
                {facilities.length > 0 ? Math.round((activeCount / facilities.length) * 100) : 0}%
              </div>
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