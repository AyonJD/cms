import { loggedInUser } from "apis/user.api";
import jwtDecode from "jwt-decode";

export const loadStorage = (key) => {
    if (typeof window !== 'undefined') {
        const value = localStorage.getItem(key);
        return value ? value : null;
    }
    return null;
};

export const verifyExpiredToken = (token) => {
    if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            return false;
        }
        return true;
    }
    return false;
};

export const getCurrentUser = async (token) => {
    const user = await loggedInUser(token)
    return user;
}