const API_BASE_URL = 'http://localhost:3000/v1'; // Updated to match your backend

// Get the JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Common headers for authenticated requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface HospitalDashboardData {
  hospitalName: string;
  city: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  emergencyBeds: number;
  facilities: string[];
  facilityStatus: Record<string, string>;
  medicalSpecialties: string[];
  rating: number;
  notes: string;
  occupancyRate: number;
  lastUpdated: string;
  metrics: {
    criticalOccupancy: boolean;
    updatedMinutesAgo: number;
  };
}

export const adminApi = {
  // Get hospital dashboard data
  getDashboard: async (): Promise<HospitalDashboardData> => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
    }

    return response.json();
  },

  // Update available beds
  updateAvailableBeds: async (availableBeds: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/hospital/update-beds`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ availableBeds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update beds: ${response.statusText}`);
    }
  },

  // Update facility status
  updateFacilityStatus: async (facility: string, status: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/hospital/update-facilities`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ facility, status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update facility: ${response.statusText}`);
    }
  },

  // Update notes
  updateNotes: async (notes: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/hospital/update-notes`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update notes: ${response.statusText}`);
    }
  },
};

// Auth API for login/signup
export const authApi = {
  login: async (email: string, password: string, role: string): Promise<{ token: string; message: string; data: any }> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  signup: async (username: string, email: string, password: string, role: string, hospitalId?: string): Promise<{ userId: string; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role, hospitalId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  },
};

// Hospital API for searching hospitals
export const hospitalApi = {
  getHospitals: async (filters: {
    city?: string;
    facility?: string;
    beds?: boolean;
    sort?: string;
    search?: string;
  }): Promise<any[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.facility) queryParams.append('facility', filters.facility);
    if (filters.beds) queryParams.append('beds', 'true');
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.search) queryParams.append('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/hospitals/filter?${queryParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hospitals: ${response.statusText}`);
    }

    return response.json();
  },

  getHospitalById: async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/hospitals/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hospital: ${response.statusText}`);
    }

    return response.json();
  },
};
