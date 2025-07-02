import { useState, useEffect } from "react";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx";
import { Bed, Plus, Minus } from "lucide-react";
import { adminApi } from "../services/adminApi";
import { useToast } from "../hooks/use-toast.js";

export function BedManagement({ onUpdate, dashboardData, bedData, setBedData }) {
  const [bedStats, setBedStats] = useState({
    total: 0,
    available: 0,
    icu: { total: 0, available: 0 },
    emergency: { total: 0, available: 0 },
    // general: { total: 0, available: 0 },
  });

  const { toast } = useToast();

  
  useEffect(() => {
    if (bedData) {
      setBedStats(bedData);
      return;
    }

    if (!dashboardData) return;

    const totalBeds = dashboardData.totalBeds || 0;
    const availableBeds = dashboardData.availableBeds || 0;
    const icuTotal = dashboardData.icuBeds || 0;
    const emergencyTotal = dashboardData.emergencyBeds || 0;

    const icuAvailable = Math.floor(icuTotal * 0.25);
    const emergencyAvailable = Math.floor(emergencyTotal * 0.5);

    const initialBedStats = {
      total: totalBeds,
      available: availableBeds,
      icu: {
        total: icuTotal,
        available: icuAvailable,
      },
      emergency: {
        total: emergencyTotal,
        available: emergencyAvailable,
      },
    };

    setBedStats(initialBedStats);
    if (setBedData) {
      setBedData(initialBedStats);
    }
  }, [dashboardData, bedData]);

  const updateBedCount = async (category, type, change) => {
   
    const newBedStats = { ...bedStats };
    
    if (category === 'available' && type === 'available') {
      const newAvailableBeds = Math.max(0, Math.min(bedStats.total, bedStats.available + change));
      newBedStats.available = newAvailableBeds;
    } else if (category === 'total') {
      newBedStats.total = Math.max(0, newBedStats.total + change);
      
      newBedStats.available = Math.min(newBedStats.available, newBedStats.total);
    } else {
      
      const cat = newBedStats[category];
      if (type === 'total') {
        cat.total = Math.max(0, cat.total + change);
        cat.available = Math.min(cat.available, cat.total);
      } else {
        cat.available = Math.max(0, Math.min(cat.total, cat.available + change));
      }
    }

    setBedStats(newBedStats);
    if (setBedData) {
      setBedData(newBedStats);
    }

    try {
      if (category === 'available' && type === 'available') {
        await adminApi.updateAvailableBeds(newBedStats.available);
        
        toast({
          title: "Success",
          description: "Available beds updated successfully",
        });
      } else {
        
        toast({
          title: "Success",
          description: `${category} beds updated successfully`,
        });
      }

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating beds:', error);
      
      setBedStats(bedStats);
      if (setBedData) {
        setBedData(bedStats);
      }
      
      toast({
        title: "Error",
        description: "Failed to update bed availability",
        variant: "destructive",
      });
    }
  };

  const bulkUpdateBeds = async (action) => {
    const prevBedStats = { ...bedStats };
    let newBedStats;

    if (action === 'markAllAvailable') {
      newBedStats = {
        ...bedStats,
        available: bedStats.total,
        icu: { ...bedStats.icu, available: bedStats.icu.total },
        emergency: { ...bedStats.emergency, available: bedStats.emergency.total },
      };
    } else if (action === 'markAllOccupied') {
      newBedStats = {
        ...bedStats,
        available: 0,
        icu: { ...bedStats.icu, available: 0 },
        emergency: { ...bedStats.emergency, available: 0 },
      };
    }

    setBedStats(newBedStats);
    if (setBedData) {
      setBedData(newBedStats);
    }

    try {
      if (action === 'markAllAvailable') {
        await adminApi.updateAvailableBeds(bedStats.total);
        toast({
          title: "Success",
          description: "All beds marked as available",
        });
      } else {
        await adminApi.updateAvailableBeds(0);
        toast({
          title: "Success",
          description: "All beds marked as occupied",
        });
      }

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating beds:', error);
      
      setBedStats(prevBedStats);
      if (setBedData) {
        setBedData(prevBedStats);
      }
      
      toast({
        title: "Error",
        description: "Failed to update bed availability",
        variant: "destructive",
      });
    }
  };

  const BedCounter = ({ 
    title, 
    total, 
    available, 
    category, 
    icon: Icon 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Total Beds</Label>
            <div className="flex items-center gap-2 mt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateBedCount(category, 'total', -1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xl font-bold text-center w-12">{total}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateBedCount(category, 'total', 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Available</Label>
            <div className="flex items-center gap-2 mt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateBedCount(category, 'available', -1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xl font-bold text-center w-12 text-green-600">{available}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateBedCount(category, 'available', 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Occupancy: {total > 0 ? Math.round(((total - available) / total) * 100) : 0}%
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Bed Management</h2>
        <p className="text-gray-600">Update bed availability across different departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BedCounter
          title="Total Hospital"
          total={bedStats.total}
          available={bedStats.available}
          category="available"
          icon={Bed}
        />
        
        <BedCounter
          title="ICU"
          total={bedStats.icu.total}
          available={bedStats.icu.available}
          category="icu"
          icon={Bed}
        />
        
        <BedCounter
          title="Emergency"
          total={bedStats.emergency.total}
          available={bedStats.emergency.available}
          category="emergency"
          icon={Bed}
        />
        
        {/* <BedCounter
          title="General Ward"
          total={bedStats.general.total}
          available={bedStats.general.available}
          category="general"
          icon={Bed}
        /> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Bulk bed availability updates</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={() => bulkUpdateBeds('markAllAvailable')}>
            Mark All Available
          </Button>
          <Button variant="outline" onClick={() => bulkUpdateBeds('markAllOccupied')}>
            Mark All Occupied
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}