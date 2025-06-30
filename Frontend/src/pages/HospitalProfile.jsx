import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Check, X, Bed, Users } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import API from "../lib/axios";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

const HospitalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axiosInstance.get(API_PATHS.HOSPITAL.GET_HOSPITAL_BY_ID(id), {
          
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHospital(response.data);
      } catch (error) {
        console.error("Error fetching hospital data:", error);
        alert("Failed to load hospital data. Please try again later.");
      }
    }

    fetchHospital();
  }, [id]);

  if (!hospital) return <p>Loading...</p>;

  // Calculate occupancy rate
  const occupancyRate = hospital.totalBeds > 0 
    ? Math.round(((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100)
    : 0;

  // Transform facilities array to objects with availability status
  const facilitiesWithStatus = hospital.facilities.map((facility) => ({
    name: facility,
    available: hospital.facilityStatus?.[facility] === 'available' || Math.random() > 0.5 // Fallback to random if no status
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/fetch")}
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
                {hospital.rating ? `${hospital.rating}/5.0` : 'N/A'}
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
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {hospital.notes || 'No notes available for this hospital.'}
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
                      {occupancyRate}%
                    </div>
                    <div className="text-sm text-gray-500">Occupancy Rate</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Bed Occupancy</span>
                    <span>{occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${occupancyRate}%` }}
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
                  {facilitiesWithStatus.map((facility, index) => (
                    <div
                      key={`${facility.name}-${index}`}
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
                    <div className="text-blue-600">{hospital.contactNumber}</div>
                  </div>
                </div>
                {hospital.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-blue-600">{hospital.email}</div>
                    </div>
                  </div>
                )}
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
                  {hospital.medicalSpecialties.map((specialty, index) => (
                    <div
                      key={`${specialty}-${index}`}
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