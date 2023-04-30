export const BASE_URL = 'https://retail-ros-ayonjd.koyeb.app';
export const SIGNUP_USER_URL = `${BASE_URL}/api/v1/auth/signup_user`;
export const LOGIN_USER_URL = `${BASE_URL}/api/v1/auth/login_user`;

// User routes
export const LOGGED_IN_USER_URL = `${BASE_URL}/api/v1/logged_in_user`;

// Client routes
export const CREATE_CLIENT_URL = `${BASE_URL}/api/v1/create_client`;
export const GET_CLIENTS_URL = `${BASE_URL}/api/v1/get_all_client`;
export const GET_CLIENT_URL = `${BASE_URL}/api/v1/get_client_by_id`;

// Service routes
export const CREATE_SERVICE_URL = `${BASE_URL}/api/v1/create_service`;
export const GET_SERVICES_URL = `${BASE_URL}/api/v1/get_all_service`;
export const UPDATE_SERVICE_URL = `${BASE_URL}/api/v1/update_service_by_id`;

// Meeting routes
export const CREATE_MEETING_URL = `${BASE_URL}/api/v1/send_email_to_client`;