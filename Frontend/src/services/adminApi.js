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
      console.log("Raw API Response:", response);
  console.log("Response type:", typeof response);
  console.log("Response keys:", Object.keys(response || {}));
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

  updateNotes: async (notes) => {
    try {
      await axiosInstance.put(
        API_PATHS.ADMIN.UPDATE_NOTES,
        { notes },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      throw new Error(
        error.response?.data?.error || `Failed to update notes: ${error.message}`
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
