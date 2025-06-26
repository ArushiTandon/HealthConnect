
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bed, Plus, Minus } from "lucide-react";

interface BedManagementProps {
  onUpdate: () => void;
}

export function BedManagement({ onUpdate }: BedManagementProps) {
  const [bedStats, setBedStats] = useState({
    total: 150,
    available: 45,
    icu: { total: 20, available: 5 },
    emergency: { total: 15, available: 8 },
    general: { total: 115, available: 32 }
  });

  const updateBedCount = (category: string, type: 'total' | 'available', change: number) => {
    setBedStats(prev => {
      const updated = { ...prev };
      if (category === 'total') {
        updated.total = Math.max(0, updated.total + change);
        updated.available = Math.max(0, updated.available + change);
      } else if (category === 'available') {
        updated.available = Math.max(0, Math.min(updated.total, updated.available + change));
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
          Occupancy: {Math.round(((total - available) / total) * 100)}%
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
          category="total"
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
          <Button onClick={() => {
            setBedStats(prev => ({
              ...prev,
              available: prev.total,
              icu: { ...prev.icu, available: prev.icu.total },
              emergency: { ...prev.emergency, available: prev.emergency.total },
              general: { ...prev.general, available: prev.general.total }
            }));
            onUpdate();
          }}>
            Mark All Available
          </Button>
          <Button variant="outline" onClick={() => {
            setBedStats(prev => ({
              ...prev,
              available: 0,
              icu: { ...prev.icu, available: 0 },
              emergency: { ...prev.emergency, available: 0 },
              general: { ...prev.general, available: 0 }
            }));
            onUpdate();
          }}>
            Mark All Occupied
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}