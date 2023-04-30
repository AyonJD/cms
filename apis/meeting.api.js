import axios from 'axios';
import { CREATE_MEETING_URL } from '../utils/urls';

export const createMeeting = async (meeting_data, token) => {
    const response = await axios.post(CREATE_MEETING_URL, meeting_data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const meeting = response;

    return meeting;
}