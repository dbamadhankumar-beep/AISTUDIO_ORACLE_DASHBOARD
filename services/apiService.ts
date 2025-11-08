import { Customer } from '../types';
import { getInitialCustomers, getLiveMetricsUpdate } from '../lib/api-mock';

// In a real application, this would use `fetch` to call a backend API.
// e.g., const BASE_URL = 'https://your-api-server.com/api/v1';

/**
 * Simulates fetching the initial list of customers and their databases.
 * In a real app, this would be: `GET /customers`
 */
export const fetchCustomersAndDatabases = (): Promise<Customer[]> => {
  console.log('API_SERVICE: Fetching initial customer and database list...');
  return new Promise(resolve => {
    // Simulate network delay
    setTimeout(() => {
      const data = getInitialCustomers();
      console.log('API_SERVICE: Received initial data.', data);
      resolve(data);
    }, 500);
  });
};

/**
 * Simulates polling a backend for the latest metrics for all databases.
 * In a real app, this might be a single efficient call: `GET /databases/realtime`
 * that returns an array of updated metrics.
 */
export const fetchRealtimeUpdates = (currentCustomers: Customer[]): Promise<Customer[]> => {
  console.log('API_SERVICE: Polling for realtime updates...');
  return new Promise(resolve => {
    // Simulate network delay
    setTimeout(() => {
        const updatedCustomers = currentCustomers.map(customer => ({
            ...customer,
            databases: customer.databases.map(db => getLiveMetricsUpdate(db))
        }));
        console.log('API_SERVICE: Received realtime updates.');
        resolve(updatedCustomers);
    }, 300);
  });
};
