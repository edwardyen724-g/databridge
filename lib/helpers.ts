import axios from 'axios';
import { NextApiRequest } from 'next';

export interface AuthedRequest extends NextApiRequest {
  userId?: string; // Custom property for storing user identity
}

export const fetchDataFromApi = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error('Error fetching data from API:', err instanceof Error ? err.message : String(err));
    throw new Error('Failed to fetch data from API');
  }
};

export const validateData = (data: any, schema: any) => {
  try {
    const result = schema.validate(data);
    return result.error ? result.error.details : null;
  } catch (err) {
    console.error('Error validating data:', err instanceof Error ? err.message : String(err));
    throw new Error('Data validation failed');
  }
};

export const logError = async (error: string, userId?: string) => {
  try {
    const logEntry = {
      error,
      userId,
      timestamp: new Date().toISOString(),
    };
    // Potentially send logEntry to a logging service or database
    console.error('Logging error:', logEntry);
  } catch (err) {
    console.error('Error logging error:', err instanceof Error ? err.message : String(err));
  }
};

export const sendNotification = async (message: string) => {
  try {
    await axios.post(process.env.NOTIFICATION_API_URL!, { message });
  } catch (err) {
    console.error('Error sending notification:', err instanceof Error ? err.message : String(err));
  }
};