import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

// Get the JWT token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Common headers for authenticated requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const adminApi = {
  getDashboard: async () => {
    
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD, {
        headers: getAuthHeaders(),
      });
      
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to fetch dashboard: ${error.message}`
      );
    }
  },

  updateAvailableBeds: async (availableBeds) => {
    try {
      await axiosInstance.put(
        API_PATHS.ADMIN.UPDATE_BEDS,
        { availableBeds },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to update beds: ${error.message}`
      );
    }
  },

  updateFacilityStatus: async (facility, status) => {
    try {
      await axiosInstance.put(
        API_PATHS.ADMIN.UPDATE_FACILITIES,
        { facility, status },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to update facility: ${error.message}`
      );
    }
  },

  getFacilityStatus: async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN.GET_FACILITIES_STATUS,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to fetch facility status: ${error.message}`
      );
    }
  },

  updateHospitalInfo: async (hospitalInfo) => {
    try {
      await axiosInstance.put(
        API_PATHS.ADMIN.UPDATE_INFO,
        hospitalInfo,
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to update notes: ${error.message}`
      );
    }
  },

  getAllAppointments: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_APPOINTMENTS, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to fetch appointments: ${error.message}`
      );
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.ADMIN.UPDATE_APPOINTMENT_STATUS(appointmentId),
        { status },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to update appointment status: ${error.message}`
      );
    }
  },
};

export const authApi = {
  login: async (email, password, role) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        { email, password, role },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Login failed: ${error.message}`
      );
    }
  },

  signup: async (username, email, password, role, hospitalId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.SIGNUP,
        { username, email, password, role, hospitalId },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Signup failed: ${error.message}`
      );
    }
  },
};

export const hospitalApi = {
  getHospitals: async (filters) => {
    try {
      const params = {};

      if (filters.city) params.city = filters.city;
      if (filters.facility) params.facility = filters.facility;
      if (filters.specialty) params.specialty = filters.specialty;
      if (filters.beds) params.beds = true;
      if (filters.sort) params.sort = filters.sort;
      if (filters.search) params.search = filters.search;

      const response = await axiosInstance.get(API_PATHS.HOSPITAL.GET_HOSPITALS, {
        headers: getAuthHeaders(),
        params,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to fetch hospitals: ${error.message}`
      );
    }
  },

  getFilterOptions: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.HOSPITAL.GET_FILTER_OPTIONS, {
        headers: getAuthHeaders(),
      });
      console.log("Filter Options API Response:", response.data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to fetch filter options: ${error.message}`
      );
    }
  },

  getHospitalById: async (_id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.HOSPITAL.GET_HOSPITAL_BY_ID(_id), {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to fetch hospital: ${error.message}`
      );
    }
  },
};

export const appointment = {
  createAppointment: async (hospitalId, date, time, reason) => {
    try {
      
      const response = await axiosInstance.post(API_PATHS.APPOINTMENT.CREATE_APPOINTMENT, {
        hospitalId,
        date,
        time,
        reason,
      }, {
        headers: getAuthHeaders(),
      })
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to create appointment: ${error.message}`
      );
      
    }
  },

  getUserAppointments: async (id) => {
    try {
      const response = await axiosInstance.get(API_PATHS.APPOINTMENT.GET_USER_APPOINTMENT(id), {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to fetch user appointments: ${error.message}`
      );
    }
  },

  cancelAppointment: async (appointmentId, status) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.APPOINTMENT.CANCEL_APPOINTMENT(appointmentId),
        { status },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to update appointment: ${error.message}`
      );
    }
  },
}
