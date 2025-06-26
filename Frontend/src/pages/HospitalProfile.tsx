// import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Check, X, Bed, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const HospitalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock hospital data - in a real app this would come from an API
  const hospital = {
    id: parseInt(id || "1"),
    name: "City General Hospital",
    address: "123 Medical Center Drive, New York, NY 10001",
    phone: "(555) 123-4567",
    email: "info@citygeneralhospital.com",
    totalBeds: 250,
    availableBeds: 45,
    occupancyRate: 82,
    facilities: [
      { name: "ICU", available: true },
      { name: "Emergency Room", available: true },
      { name: "Surgery Center", available: true },
      { name: "Trauma Center", available: false },
      { name: "Maternity Ward", available: true },
      { name: "Pediatric Unit", available: true },
      { name: "Radiology", available: true },
      { name: "Laboratory", available: false },
    ],
    specialties: [
      "Cardiology",
      "Neurology", 
      "Orthopedics",
      "Pediatrics",
      "Emergency Medicine",
      "Internal Medicine",
      "Surgery",
      "Radiology"
    ],
    rating: 4.8,
    description: "City General Hospital is a leading healthcare provider committed to delivering exceptional medical care to our community. With state-of-the-art facilities and a team of dedicated professionals, we provide comprehensive healthcare services across multiple specialties."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/results")}
            className="mb-4 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hospital List
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hospital.name}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{hospital.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {hospital.rating}/5.0
              </div>
              <div className="text-sm text-gray-500">Patient Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About This Hospital</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {hospital.description}
                </p>
              </CardContent>
            </Card>

            {/* Bed Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  Bed Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {hospital.totalBeds}
                    </div>
                    <div className="text-sm text-gray-500">Total Beds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {hospital.availableBeds}
                    </div>
                    <div className="text-sm text-gray-500">Available Now</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {hospital.occupancyRate}%
                    </div>
                    <div className="text-sm text-gray-500">Occupancy Rate</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Bed Occupancy</span>
                    <span>{hospital.occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${hospital.occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Facility Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospital.facilities.map((facility) => (
                    <div
                      key={facility.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">
                        {facility.name}
                      </span>
                      <div className="flex items-center">
                        {facility.available ? (
                          <>
                            <Check className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-600 text-sm font-medium">
                              Available
                            </span>
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-red-600 text-sm font-medium">
                              Unavailable
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Section */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive map will be displayed here</p>
                    <p className="text-sm text-gray-400 mt-1">{hospital.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Phone</div>
                    <div className="text-blue-600">{hospital.phone}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-blue-600">{hospital.email}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      {hospital.address}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Medical Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {hospital.specialties.map((specialty) => (
                    <div
                      key={specialty}
                      className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {specialty}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full">
                  Emergency Contact
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;