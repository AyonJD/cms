import axios from 'axios';
import {
  CREATE_CLIENT_URL,
  GET_CLIENTS_URL,
  GET_CLIENT_URL,
  UPDATE_CLIENT_URL
} from '../utils/urls';

export const createClient = async (client_data, token) => {
  const response = await axios.post(CREATE_CLIENT_URL, client_data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const client = response;

  return client;
};

export const getAllClient = async (token) => {
  const response = await axios.get(GET_CLIENTS_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const clients = response.data;

  return clients;
};

export const getClientById = async (client_id, token) => {
  const response = await axios.get(`${GET_CLIENT_URL}/${client_id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const client = response.data;

  return client;
};

export const updateClientById = async (client_id, client_data, token) => {
  const response = await axios.patch(
    `${UPDATE_CLIENT_URL}/${client_id}`,
    client_data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const client = response.data;

  return client;
};
