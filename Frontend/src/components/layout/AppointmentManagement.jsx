import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../hooks/use-toast';

const AppointmentManagement = ({ onUpdate, dashboardData }) => {
  const [allAppointments, setAllAppointments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Only fetch data on component mount
  useEffect(() => {
    fetchAppointments();
  }, []); // Remove filters dependency

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllAppointments();
      const all = response?.appointments || [];
      setAllAppointments(all); // This stays static unless manually refreshed
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
    if (onUpdate) onUpdate();
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await adminApi.updateAppointmentStatus(appointmentId, newStatus);
      
      // Update local state
      setAllAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );

      toast({
        title: "Success",
        description: `Appointment ${newStatus} successfully`,
        variant: "default",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Error", 
        description: error.message || "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  // Filter and sort appointments using useMemo for performance
  const filteredAndSortedAppointments = useMemo(() => {
    return allAppointments.filter((appointment) => {
      // Status filter
      if (filters.status !== "all" && appointment.status !== filters.status) {
        return false;
      }

      // Date filter
      if (filters.date && appointment.date !== filters.date) {
        return false;
      }

      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          appointment.userId?.username?.toLowerCase().includes(searchLower) ||
          appointment.userId?.email?.toLowerCase().includes(searchLower) ||
          appointment.reason?.toLowerCase().includes(searchLower) ||
          appointment.specialty?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [allAppointments, filters, searchTerm]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      Confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      Completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
      Cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      Rejected: { color: 'bg-gray-100 text-purple-800', label: 'Rejected' }
    };
      
    const config = statusConfig[status] || statusConfig.Pending;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusCounts = () => {
    if (!Array.isArray(allAppointments)) return { total: 0 };

    return allAppointments.reduce((acc, apt) => {
      const status = apt.status || 'Pending';
      acc[status] = (acc[status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = useMemo(() => getStatusCounts(), [allAppointments]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{statusCounts.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{statusCounts.Pending || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{statusCounts.Confirmed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold">{statusCounts.Cancelled || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>
                Manage and track all appointments for your hospital
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, email, or reason..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAndSortedAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No appointments found</p>
                <p className="text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              filteredAndSortedAppointments.map((appointment) => (
                <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{appointment.userId?.username || 'N/A'}</span>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(appointment.time)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{appointment.userId?.email || 'N/A'}</span>
                          </div>
                        </div>
                        
                        {appointment.reason && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-700">
                              <strong>Reason:</strong> {appointment.reason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {appointment.status?.toLowerCase() === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment._id, 'Confirmed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment._id, 'Rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {appointment.status?.toLowerCase() === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Appointment Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <p className="text-gray-900">{selectedAppointment.userId?.username || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{selectedAppointment.userId?.email || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-gray-900">{formatDate(selectedAppointment.date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <p className="text-gray-900">{formatTime(selectedAppointment.time)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                {getStatusBadge(selectedAppointment.status)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedAppointment.reason || 'No reason provided'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-900">
                  {new Date(selectedAppointment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
              {selectedAppointment.status?.toLowerCase() === 'pending' && (
                <>
                  <Button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment._id, 'Confirmed');
                      setShowModal(false);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment._id, 'Rejected');
                      setShowModal(false);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;