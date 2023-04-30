import axios from 'axios';
import { LOGIN_USER_URL, SIGNUP_USER_URL } from '../utils/urls.js';

/**
 * This function signs up a user and returns an access token.
 * @param user_data - This parameter is an object that contains the user's data such as their email,
 * password, name, etc. It is used to create a new user account in the system.
 * @returns the access token obtained from the response headers after making a POST request to the
 * SIGNUP_USER_URL endpoint with the user_data and withCredentials set to true.
 */
export const signUpUser = async (user_data) => {
    const response = await axios.post(SIGNUP_USER_URL, user_data, { withCredentials: true });
    const accessToken = response.headers.authorization && response.headers.authorization.split(' ')[1];

    return accessToken;
}

export const loginUser = async (user_data) => {
    const response = await axios.post(LOGIN_USER_URL, user_data, { withCredentials: true });
    const accessToken = response.headers.authorization && response.headers.authorization.split(' ')[1];

    return accessToken;
}