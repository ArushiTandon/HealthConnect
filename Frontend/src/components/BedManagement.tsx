import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bed, Plus, Minus } from "lucide-react";
import {type HospitalDashboardData, adminApi } from "../services/adminApi";
import { useToast } from "../hooks/use-toast";

interface BedManagementProps {
  onUpdate: () => void;
  dashboardData: HospitalDashboardData;
}

export function BedManagement({ onUpdate, dashboardData }: BedManagementProps) {
  const [bedStats, setBedStats] = useState({
    total: 150,
    available: 45,
    icu: { total: 20, available: 5 },
    emergency: { total: 15, available: 8 },
    general: { total: 115, available: 32 }
  });

  const { toast } = useToast();

  // Update bed stats based on dashboard data
  useEffect(() => {
    setBedStats({
      total: dashboardData.totalBeds,
      available: dashboardData.availableBeds,
      icu: { total: dashboardData.icuBeds, available: Math.floor(dashboardData.icuBeds * 0.25) },
      emergency: { total: dashboardData.emergencyBeds, available: Math.floor(dashboardData.emergencyBeds * 0.5) },
      general: { 
        total: dashboardData.totalBeds - dashboardData.icuBeds - dashboardData.emergencyBeds, 
        available: dashboardData.availableBeds - Math.floor(dashboardData.icuBeds * 0.25) - Math.floor(dashboardData.emergencyBeds * 0.5)
      }
    });
  }, [dashboardData]);

  const updateBedCount = async (category: string, type: 'total' | 'available', change: number) => {
    if (category === 'available' && type === 'available') {
      const newAvailableBeds = Math.max(0, Math.min(bedStats.total, bedStats.available + change));
      
      try {
        await adminApi.updateAvailableBeds(newAvailableBeds);
        
        setBedStats(prev => ({
          ...prev,
          available: newAvailableBeds
        }));

        toast({
          title: "Success",
          description: "Available beds updated successfully",
        });

        onUpdate();
      } catch (error) {
        console.error('Error updating beds:', error);
        toast({
          title: "Error",
          description: "Failed to update bed availability",
          variant: "destructive",
        });
      }
    } else {
      // For other categories, update locally (in real app, would need separate APIs)
      setBedStats(prev => {
        const updated = { ...prev };
        if (category === 'total') {
          updated.total = Math.max(0, updated.total + change);
          updated.available = Math.max(0, updated.available + change);
        } else {
          const cat = updated[category as keyof typeof updated] as { total: number; available: number };
          if (type === 'total') {
            cat.total = Math.max(0, cat.total + change);
            cat.available = Math.min(cat.available, cat.total);
          } else {
            cat.available = Math.max(0, Math.min(cat.total, cat.available + change));
          }
        }
        return updated;
      });
      onUpdate();
    }
  };

  const BedCounter = ({ 
    title, 
    total, 
    available, 
    category, 
    icon: Icon 
  }: { 
    title: string; 
    total: number; 
    available: number; 
    category: string;
    icon: any;
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
        
        <BedCounter
          title="General Ward"
          total={bedStats.general.total}
          available={bedStats.general.available}
          category="general"
          icon={Bed}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Bulk bed availability updates</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={async () => {
            try {
              await adminApi.updateAvailableBeds(bedStats.total);
              setBedStats(prev => ({
                ...prev,
                available: prev.total,
                icu: { ...prev.icu, available: prev.icu.total },
                emergency: { ...prev.emergency, available: prev.emergency.total },
                general: { ...prev.general, available: prev.general.total }
              }));
              toast({
                title: "Success",
                description: "All beds marked as available",
              });
              onUpdate();
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to update bed availability",
                variant: "destructive",
              });
            }
          }}>
            Mark All Available
          </Button>
          <Button variant="outline" onClick={async () => {
            try {
              await adminApi.updateAvailableBeds(0);
              setBedStats(prev => ({
                ...prev,
                available: 0,
                icu: { ...prev.icu, available: 0 },
                emergency: { ...prev.emergency, available: 0 },
                general: { ...prev.general, available: 0 }
              }));
              toast({
                title: "Success",
                description: "All beds marked as occupied",
              });
              onUpdate();
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to update bed availability",
                variant: "destructive",
              });
            }
          }}>
            Mark All Occupied
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}