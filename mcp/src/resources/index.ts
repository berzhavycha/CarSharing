import { McpServer, ResourceTemplate } from '@modelcontextprotocol/server';
import { getApiClient } from '../api/client';

export function registerResources(server: McpServer): void {

  server.registerResource(
    'car-detail',
    new ResourceTemplate('car:///{carId}', { list: undefined }),
    { description: 'Fetch details for a specific car by ID' },
    async (uri, { carId }, { sessionId }) => {
      const api = await getApiClient(sessionId);
      const { data } = await api.get(`/cars/${carId}`);

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(data),
        }],
      };
    },
  );

  server.registerResource(
    'user-profile',
    new ResourceTemplate('user:///{userId}/profile', { list: undefined }),
    { description: 'Fetch profile information for a specific user' },
    async (uri, { userId }, { sessionId }) => {
      const api = await getApiClient(sessionId);
      const { data } = await api.get(`/users/${userId}`);

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(data),
        }],
      };
    },
  );

  server.registerResource(
    'booking-history',
    new ResourceTemplate('bookings:///{userId}/history', { list: undefined }),
    { description: 'Fetch rental booking history for a specific user' },
    async (uri, { userId }, { sessionId }) => {
      const api = await getApiClient(sessionId);
      const { data } = await api.get('/rentals/history');
      const [rentals, total] = data;

      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ rentals, total }),
        }],
      };
    },
  );
}
