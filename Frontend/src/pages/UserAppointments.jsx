import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  RotateCcw,
  Plus,
  ChevronDown,
  Search,
  ArrowLeft,
} from "lucide-react";
import { appointmentApi } from "../services/adminApi";
import AppointmentForm from "../components/ui/AppointmentForm";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";

const UserAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Date");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    
    const getUserId = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.id || payload.userId;
        } catch (error) {
          console.error('Error parsing token:', error);
          return null;
        }
      }
      return null;
    };

    const currentUserId = getUserId();
    setUserId(currentUserId);

    // Connect socket and register user
    if (currentUserId && !socket.connected) {
      socket.connect();
      
      socket.on('connect', () => {
        console.log('Socket connected, registering user:', currentUserId);
        socket.emit('register-user', currentUserId);
      });
    }

    const loadAppointments = async () => {
      try {
        await fetchAppointments();
      } catch (error) {
        console.error("Failed to load appointments:", error);
        setError("Failed to load appointments. Please refresh the page.");
      }
    };
    
    loadAppointments();

    // Socket event listener for appointment updates
    const handleAppointmentUpdate = (data) => {
      console.log('Received appointment update:', data);
      
      setAppointments((prevAppointments) => {
        const updatedAppointments = prevAppointments.map((apt) => {
          if (apt._id === data.appointment._id) {
            return {
              ...apt,
              status: data.status,
              ...data.appointment, 
            };
          }
          return apt;
        });
        
        // Show notification to user
        if (data.message) {
          // You can use a toast library here or show a browser notification
          console.log('Appointment Update:', data.message);

        }
        
        return updatedAppointments;
      });
    };

    socket.on("appointmentStatusUpdated", handleAppointmentUpdate);

    return () => {
      socket.off("appointmentStatusUpdated", handleAppointmentUpdate);
     
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await appointmentApi.getUserAppointments();
      setAppointments(response.appointments || response);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (formData) => {
  try {
    setError(null);

    const { hospitalId, date, time, reason } = formData;
    const response = await appointmentApi.createAppointment(
      hospitalId,
      date,
      time,
      reason
    );

    await fetchAppointments();
    
    setIsFormOpen(false);
    console.log("Appointment booked successfully!");
  } catch (error) {
    console.error("Error booking appointment:", error);
    setError("Failed to book appointment. Please try again.");
  }
};

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setError(null);
      await appointmentApi.cancelAppointment(appointmentId, "Cancelled");

      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: "Cancelled" } : apt
        )
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setError("Failed to cancel appointment. Please try again.");
      
      
      await fetchAppointments();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Rejected":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSpecialtyIcon = (specialty) => {
    switch (specialty) {
      case "Oncology":
        return "🩺";
      case "Cardiology":
        return "❤️";
      case "Radiology":
        return "📡";
      case "Internal Medicine":
        return "⚕️";
      default:
        return "🏥";
    }
  };

  // Filter and sort appointments
  const filteredAndSortedAppointments = appointments
    .filter((appointment) => {
      // Filter by status
      if (filter !== "All Statuses" && appointment.status !== filter) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          appointment.hospitalId?.name?.toLowerCase().includes(searchLower) ||
          appointment.reason?.toLowerCase().includes(searchLower) ||
          appointment.specialty?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Date":
          return new Date(b.date) - new Date(a.date);
        case "Specialty":
          return (a.specialty || "").localeCompare(b.specialty || "");
        case "Status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-medium text-gray-600">
              Loading appointments...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hospital List
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Appointments
            </h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm font-medium"
            >
              <Plus size={18} />
              <span>Book New</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={fetchAppointments}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              <RotateCcw size={16} />
              <span className="text-sm">Refresh</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Date</option>
                <option>Status</option>
              </select>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Rejected</option>
              <option>Cancelled</option>
            </select>

            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by hospital or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAndSortedAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                {/* Left side - Main appointment info */}
                <div className="flex items-start space-x-4">
                  <div className="text-2xl mt-1">
                    {getSpecialtyIcon(appointment.reason)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.hospitalId?.name}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{formatDate(appointment.date)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{appointment.time}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin size={14} />
                        <span className="font-medium">
                          {appointment.hospitalId?.address}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-500">
                        <Phone size={14} />
                        <span>{appointment.hospitalId?.contactNumber}</span>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Reason:</span>{" "}
                          {appointment.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Created date and actions */}
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-4">
                    Created: {formatDate(appointment.createdAt)}
                  </div>

                  <div className="flex flex-col space-y-2">
                    {["Pending", "Confirmed"].includes(appointment.status) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="text-sm text-red-600 hover:text-red-800 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedAppointments.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-400 text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {appointments.length === 0
                ? "No appointments yet"
                : "No appointments match your filters"}
            </h3>
            <p className="text-gray-500 mb-4">
              {appointments.length === 0
                ? "Book your first appointment to get started"
                : "Try adjusting your search or filter criteria"}
            </p>
            {appointments.length === 0 && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Book Appointment
              </button>
            )}
          </div>
        )}
      </div>
      <AppointmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleBookAppointment}
      />
    </div>
  );
};

export default UserAppointments;