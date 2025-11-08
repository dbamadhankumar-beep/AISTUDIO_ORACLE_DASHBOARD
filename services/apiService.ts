import { Customer } from '../types';

// Use a relative path for the API endpoint. This works because the Node.js server
// serves both the API and the frontend from the same origin.
const API_BASE_URL = '/api';

/**
 * Fetches the latest state of all customers and their databases from the server.
 * This function is used for both the initial data load and for periodic polling.
 */
const fetchAllData = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/frontend/data`);
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      // Return an empty array on error to prevent the UI from crashing.
      return [];
    }
    const data = await response.json();
    // Ensure the response is the expected array type, even if empty.
    if (!Array.isArray(data)) {
      console.error("API Error: Expected an array of customers, but received:", data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Network or parsing error while fetching data:', error);
    // Return an empty array so the UI can display a "waiting for data" message.
    return [];
  }
};

/**
 * Fetches the initial list of customers and their databases from the server.
 */
export const fetchCustomersAndDatabases = (): Promise<Customer[]> => {
  console.log('API_SERVICE: Fetching initial data from server...');
  return fetchAllData();
};

/**
 * Fetches the latest metrics for all databases to provide live updates.
 */
export const fetchRealtimeUpdates = (): Promise<Customer[]> => {
  console.log('API_SERVICE: Polling for realtime updates from server...');
  return fetchAllData();
};
