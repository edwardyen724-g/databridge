import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};

export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};

export const updateData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};