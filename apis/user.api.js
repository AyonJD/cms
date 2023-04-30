import axios from "axios";
import { LOGGED_IN_USER_URL } from "../utils/urls";

export const loggedInUser = async (token) => {
    const response = await axios.get(LOGGED_IN_USER_URL, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
}