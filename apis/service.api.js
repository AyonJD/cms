import axios from "axios";
import { CREATE_SERVICE_URL, GET_SERVICES_URL } from "../utils/urls";

export const createService = async (service_data, token) => {
    const response = await axios.post(CREATE_SERVICE_URL, service_data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const service = response;

    return service;
};

export const getAllService = async (token) => {
    const response = await axios.get(GET_SERVICES_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const services = response.data;

    return services;
};