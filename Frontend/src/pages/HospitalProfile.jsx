import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
  Bed,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { appointmentApi, hospitalApi } from "../services/adminApi.js";
import socket from "../services/socket.js";

const HospitalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleAppointmentSubmit = async () => {
    try {
      await appointmentApi.createAppointment(
        hospital._id,
        appointmentData.date,
        appointmentData.time,
        appointmentData.reason
      );

      alert("Appointment Scheduled!");
      setShowAppointmentForm(false);
    } catch (err) {
      console.error("Failed to schedule:", err);
      alert("Failed to schedule appointment.");
    }
  };

  const handleGetDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);

        const hospitalData = await hospitalApi.getHospitalById(id);
        setHospital(hospitalData);
        setError(null);
      } catch (error) {
        console.error("Error fetching hospital data:", error);
        setError("Failed to load hospital data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  useEffect(() => {
    socket.emit("join-hospital-room", id);

    socket.on("bedAvailabilityUpdated", (data) => {
      if (data.hospitalId === id) {
        setHospital((prev) => ({
          ...prev,
          availableBeds: data.availableBeds,
          lastUpdated: data.lastUpdated,
        }));
      }
    });

    socket.on("facilityStatusUpdated", (data) => {
  
  if (data.hospitalId === id) {
   
    setHospital((prev) => {
      const newState = {
        ...prev,
        facilityStatus: {
          ...prev.facilityStatus,
          ...data.facilityStatus,
        },
        lastUpdated: data.lastUpdated,
      };
      
      return newState;
    });
  } else {
    console.log("Hospital ID mismatch:", data.hospitalId, "vs", id);
  }
});

    socket.on("hospitalInfoUpdated", (data) => {
      if (data.hospitalId === id) {
        setHospital((prev) => ({
          ...prev,
          ...data.updatedFields,
          lastUpdated: data.lastUpdated,
        }));
      }
    });

    return () => {
      socket.emit("leave-hospital-room", id);
      socket.disconnect();
    };
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hospital information...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/fetch")} variant="outline">
            Back to Hospital List
          </Button>
        </div>
      </div>
    );

  if (!hospital) return null;

  // Calculate occupancy rate
  const occupancyRate =
    hospital.totalBeds > 0
      ? Math.round(
          ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) *
            100
        )
      : 0;

  // Get facility availability status properly
  const getFacilityStatus = (facilityName) => {
    if (!hospital.facilityStatus) {
      return true; // Default to available if no status information
    }

    // Check for exact match first
    if (hospital.facilityStatus[facilityName] !== undefined) {
      return hospital.facilityStatus[facilityName] === "Available";
    }

    // Check for common facility name variations
    const facilityLower = facilityName.toLowerCase();
    const statusEntries = Object.entries(hospital.facilityStatus);

    for (const [key, value] of statusEntries) {
      const keyLower = key.toLowerCase();

      // Handle common mappings
      if (
        (facilityLower === "emergency" &&
          keyLower === "emergency department") ||
        (facilityLower === "pharmacy" && keyLower === "pharmacy") ||
        (facilityLower === "maternity" && keyLower === "maternity") ||
        facilityLower === keyLower
      ) {
        return value === "Available";
      }
    }

    // If no match found, default to available
    return true;
  };

  // Transform facilities array to objects with availability status
  const facilitiesWithStatus = hospital.facilities
    ? hospital.facilities.map((facility) => ({
        name: facility,
        available: getFacilityStatus(facility),
      }))
    : [];

  // Separate available and unavailable facilities
  const availableFacilities = facilitiesWithStatus.filter((f) => f.available);
  const unavailableFacilities = facilitiesWithStatus.filter(
    (f) => !f.available
  );

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
              {hospital.lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(hospital.lastUpdated).toLocaleString()}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {hospital.rating ? `${hospital.rating}/5.0` : "N/A"}
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
                  {hospital.notes || "No notes available for this hospital."}
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

            {/* Available Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Available Facilities</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {availableFacilities.length} Available
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableFacilities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableFacilities.map((facility, index) => (
                      <div
                        key={`available-${facility.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <span className="font-medium text-gray-900">
                          {facility.name}
                        </span>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-600 text-sm font-medium">
                            Available
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No facilities are currently available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Unavailable Facilities (Only show if there are any) */}
            {unavailableFacilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Temporarily Unavailable Facilities</span>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {unavailableFacilities.length} Unavailable
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unavailableFacilities.map((facility, index) => (
                      <div
                        key={`unavailable-${facility.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <span className="font-medium text-gray-900">
                          {facility.name}
                        </span>
                        <div className="flex items-center">
                          <X className="h-5 w-5 text-red-600 mr-2" />
                          <span className="text-red-600 text-sm font-medium">
                            Unavailable
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      These facilities are temporarily unavailable. Please
                      contact the hospital for more information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map Section */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Interactive map will be displayed here
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {hospital.address}
                    </p>
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
                    <div className="text-blue-600">
                      {hospital.contactNumber}
                    </div>
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

            {/* Facility Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Facility Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Total Facilities
                    </span>
                    <span className="font-semibold">
                      {facilitiesWithStatus.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">
                      Available Now
                    </span>
                    <span className="font-semibold text-green-600">
                      {availableFacilities.length}
                    </span>
                  </div>
                  {unavailableFacilities.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-600">
                        Temporarily Unavailable
                      </span>
                      <span className="font-semibold text-red-600">
                        {unavailableFacilities.length}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            {hospital.medicalSpecialties &&
              hospital.medicalSpecialties.length > 0 && (
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
              )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowAppointmentForm(true)}
                >
                  Schedule Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGetDirections(hospital.address)}
                >
                  Get Directions
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowEmergency((prev) => !prev)}
                >
                  {showEmergency ? "Hide Contact" : "Emergency Contact"}
                </Button>

                {showEmergency && (
                  <div className="text-center mt-2 text-red-600 font-semibold">
                    Emergency Contact:{" "}
                    {hospital.emergencyContact || hospital.contactNumber}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Schedule Appointment</h2>
            <div className="space-y-3">
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={appointmentData.date}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    date: e.target.value,
                  })
                }
              />

              <input
                type="time"
                className="w-full p-2 border rounded"
                value={appointmentData.time}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    time: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Reason for Appointment"
                className="w-full p-2 border rounded"
                value={appointmentData.reason}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    reason: e.target.value,
                  })
                }
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAppointmentForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAppointmentSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalProfile;
