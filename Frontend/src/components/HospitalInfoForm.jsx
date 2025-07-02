import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast.js";
import { adminApi } from "../services/adminApi";

export function HospitalInfoForm({ onUpdate, dashboardData, hospitalData, setHospitalData }) {
  const { toast } = useToast();
  const [hospitalInfo, setHospitalInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    notes: "",
    emergencyPhone: "",
    departments: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {

    if (hospitalData) {
      setHospitalInfo(hospitalData);
      setOriginalData(hospitalData);
      return;
    }

    if (dashboardData) {
      const newHospitalInfo = {
        name: dashboardData.hospitalName || "",
        address: dashboardData.address || "",
        phone: dashboardData.contactNumber || "",
        email: dashboardData.email || "",
        website: dashboardData.website || "",
        notes: dashboardData.notes || "",
        emergencyPhone: dashboardData.contactNumber || "",
        departments: dashboardData.medicalSpecialties?.join(", ") || ""
      };
      
      setHospitalInfo(newHospitalInfo);
      setOriginalData(newHospitalInfo);
      
      // Store in parent for persistence
      if (setHospitalData) {
        setHospitalData(newHospitalInfo);
      }
    }
  }, [dashboardData, hospitalData, setHospitalData]);

  const handleInputChange = (field, value) => {
    const updatedInfo = {
      ...hospitalInfo,
      [field]: value
    };
    
    setHospitalInfo(updatedInfo);
    
    if (setHospitalData) {
      setHospitalData(updatedInfo);
    }
  };

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const updateData = {
        name: hospitalInfo.name,
        address: hospitalInfo.address,
        contactNumber: hospitalInfo.phone,
        email: hospitalInfo.email,
        website: hospitalInfo.website,
        notes: hospitalInfo.notes,
        medicalSpecialties: hospitalInfo.departments 
      };

      await adminApi.updateHospitalInfo(updateData);
      
      setOriginalData(hospitalInfo);
      
      toast({
        title: "Hospital information updated",
        description: "Your changes have been saved successfully.",
      });

      if (onUpdate) onUpdate();
      
    } catch (error) {
      console.error('Error updating hospital info:', error);
      
      if (originalData) {
        setHospitalInfo(originalData);
        if (setHospitalData) {
          setHospitalData(originalData);
        }
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to update hospital information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    if (originalData) {
      setHospitalInfo(originalData);
      if (setHospitalData) {
        setHospitalData(originalData);
      }
      
      toast({
        title: "Changes discarded",
        description: "All unsaved changes have been reverted.",
      });
    }
  };

  if (!dashboardData && !hospitalData) {
    return <p className="text-gray-600">Loading hospital information...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Hospital Information</h2>
          <p className="text-gray-600">Update your hospital's basic information and contact details</p>
        </div>
       
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
                placeholder="Enter hospital name"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={hospitalInfo.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-1"
                rows={4}
                placeholder="Add any additional notes or information about your hospital"
                disabled={isLoading}
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
                placeholder="List main departments separated by commas (e.g., Cardiology, Neurology, Emergency)"
                disabled={isLoading}
              />
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
                placeholder="Enter full hospital address"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="phone">Main Phone</Label>
              <Input
                id="phone"
                value={hospitalInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
                placeholder="Enter main contact number"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Emergency Phone</Label>
              <Input
                id="emergencyPhone"
                value={hospitalInfo.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                className="mt-1"
                placeholder="Enter emergency contact number"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">This field is for display purposes only</p>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={hospitalInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                placeholder="Enter hospital email address"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={hospitalInfo.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="mt-1"
                placeholder="Enter hospital website URL"
                disabled={isLoading}
              />
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
            <Button 
              onClick={handleSave} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDiscard}
              disabled={isLoading}
            >
              Discard Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}