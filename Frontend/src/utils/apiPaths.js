export const BASE_URL = "http://localhost:3000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/v1/users/login",
        SIGNUP: "/v1/users/signup",
    },

    HOSPITAL: {
        GET_HOSPITALS: "/v1/hospitals/filter",
        GET_HOSPITAL_BY_ID: (id) => `/v1/hospitals/gethospital/${id}`,
    },


    ADMIN: {
        DASHBOARD: "/v1/admin/dashboard",
        UPDATE_BEDS: "/v1/admin/update-beds",
        UPDATE_FACILITIES: "/v1/admin/update-facilities",
        UPDATE_NOTES: "/v1/admin/update-notes",
    },

};