// export const BASE_URL = 'https://cms-server-omega.vercel.app';
export const BASE_URL = 'http://localhost:8000';
export const SIGNUP_USER_URL = `${BASE_URL}/auth/signup_user`;
export const LOGIN_USER_URL = `${BASE_URL}/auth/login_user`;

// User routes
export const LOGGED_IN_USER_URL = `${BASE_URL}/api/v1/logged_in_user`;

// Client routes
export const CREATE_CLIENT_URL = `${BASE_URL}/api/v1/create_client`;
export const GET_CLIENTS_URL = `${BASE_URL}/api/v1/get_all_client`;
export const GET_CLIENT_URL = `${BASE_URL}/api/v1/get_client_by_id`;
export const UPDATE_CLIENT_URL = `${BASE_URL}/api/v1/update_client_by_id`;

// Service routes
export const CREATE_SERVICE_URL = `${BASE_URL}/api/v1/create_service`;
export const GET_SERVICES_URL = `${BASE_URL}/api/v1/get_all_service`;
export const UPDATE_SERVICE_URL = `${BASE_URL}/api/v1/update_service_by_id`;

// Meeting routes
export const CREATE_MEETING_URL = `${BASE_URL}/api/v1/send_email_to_client`;
