import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { adminApi } from "../services/adminApi";

export function HospitalInfoForm({ onUpdate, dashboardData }) {
  const { toast } = useToast();
  const [hospitalInfo, setHospitalInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    emergencyPhone: "",
    departments: ""
  });

  // Update form with dashboard data
  useEffect(() => {
    if (!dashboardData) return;

    setHospitalInfo({
      name: dashboardData.hospitalName || "",
      address: dashboardData.address || "",
      phone: dashboardData.contactNumber || "",
      email: dashboardData.email || "",
      website: dashboardData.website || "",
      notes: dashboardData.notes || "",
      emergencyPhone: dashboardData.contactNumber || "",
      departments: dashboardData.medicalSpecialties?.join(", ") || ""
    });
  }, [dashboardData]);

  const handleInputChange = (field, value) => {
    setHospitalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Update notes (description) via API
      if (hospitalInfo.notes !== dashboardData.notes) {
        await adminApi.updateNotes(hospitalInfo.notes);
      }
      
      onUpdate();
      toast({
        title: "Hospital information updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating hospital info:', error);
      toast({
        title: "Error",
        description: "Failed to update hospital information",
        variant: "destructive",
      });
    }
  };

  if (!dashboardData) {
  return <p className="text-gray-600">Loading hospital information...</p>;
}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Hospital Information</h2>
        <p className="text-gray-600">Update your hospital's basic information and contact details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Hospital name and notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Hospital Name</Label>
              <Input
                id="name"
                value={hospitalInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Contact system admin to change hospital name</p>
            </div>
            <div>
              <Label htmlFor="notes">notes</Label>
              <Textarea
                id="notes"
                value={hospitalInfo.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="departments">Departments & Specialties</Label>
              <Textarea
                id="departments"
                value={hospitalInfo.departments}
                onChange={(e) => handleInputChange('departments', e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="List main departments separated by commas"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Contact system admin to update specialties</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How patients can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={hospitalInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1"
                rows={2}
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Contact system admin to change address</p>
            </div>
            <div>
              <Label htmlFor="phone">Main Phone</Label>
              <Input
                id="phone"
                value={hospitalInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Contact system admin to change phone</p>
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Emergency Phone</Label>
              <Input
                id="emergencyPhone"
                value={hospitalInfo.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                className="mt-1"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={hospitalInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Contact system admin to change email</p>
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={hospitalInfo.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="mt-1"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Contact system admin to change website</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Save Changes</CardTitle>
          <CardDescription>Review and save your hospital information updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => {
              // Reset to dashboard data
              setHospitalInfo({
                name: dashboardData.hospitalName || "",
                address: dashboardData.address || "",
                phone: dashboardData.contactNumber || "",
                email: dashboardData.email || "",
                website: dashboardData.website || "",
                notes: dashboardData.notes || "",
                emergencyPhone: dashboardData.contactNumber || "",
                departments: dashboardData.medicalSpecialties?.join(", ") || ""
              });
              toast({
                title: "Changes discarded",
                description: "All unsaved changes have been reverted.",
              });
            }}>
              Discard Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}