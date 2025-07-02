export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
    AUTH: {
        LOGIN: "/v1/users/login",
        SIGNUP: "/v1/users/signup",
    },

    HOSPITAL: {
        GET_HOSPITALS: "/v1/hospitals/filter",
        GET_FILTER_OPTIONS: "/v1/hospitals/filter-options",
        GET_HOSPITAL_BY_ID: (id) => `/v1/hospitals/fetch/${id}`,
    },


    ADMIN: {
        DASHBOARD: "/v1/admin/dashboard",
        UPDATE_BEDS: "/v1/admin/update-beds",
        UPDATE_FACILITIES: "/v1/admin/update-facilities",
        GET_FACILITIES_STATUS: "/v1/admin/facility-status",
        UPDATE_INFO: "/v1/admin/update-info",
    },

};