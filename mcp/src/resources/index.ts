import { McpServer, ResourceTemplate } from '@modelcontextprotocol/server';
import { getApiClient } from '../api/client';

export function registerResources(server: McpServer): void {

  server.registerResource(
    'car-detail',
    new ResourceTemplate('car:///{carId}', {
      list: async (extra) => {
        const sessionId = (extra as any)?.sessionId;
        try {
          const api = await getApiClient(sessionId);
          const { data } = await api.get('/cars');
          const cars = Array.isArray(data) ? data : data[0] ?? [];
          return {
            resources: cars.map((car: any) => ({
              uri: `car:///${car.id}`,
              name: `${car.brand} ${car.model} (${car.year})`,
              description: `${car.type} — $${car.pricePerHour}/hr`,
              mimeType: 'application/json',
            })),
          };
        } catch {
          return { resources: [] };
        }
      },
    }),
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
    new ResourceTemplate('user:///{userId}/profile', {
      list: async (extra) => {
        const sessionId = (extra as any)?.sessionId;
        try {
          const api = await getApiClient(sessionId);
          const { data } = await api.get('/users');
          const users = Array.isArray(data) ? data : data[0] ?? [];
          return {
            resources: users.map((user: any) => ({
              uri: `user:///${user.id}/profile`,
              name: `${user.firstName} ${user.lastName}`,
              description: user.email,
              mimeType: 'application/json',
            })),
          };
        } catch {
          return { resources: [] };
        }
      },
    }),
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

  // While the Model Context Protocol (MCP) spec allows for resource templates with dynamic variables (e.g., greeting://{name} or users://{userId}), Claude Desktop has an open, documented issue where it fails to parse or resolve them. It calls the static resources/list on startup but struggles to interact with dynamic arguments on demand.
  server.registerResource(
    'booking-history',
    new ResourceTemplate('bookings:///{userId}/history', {
      list: async (extra) => {
        const sessionId = (extra as any)?.sessionId;
        try {
          const api = await getApiClient(sessionId);
          const { data } = await api.get('/users');
          const users = Array.isArray(data) ? data : data[0] ?? [];
          return {
            resources: users.map((user: any) => ({
              uri: `bookings:///${user.id}/history`,
              name: `${user.firstName} ${user.lastName} — booking history`,
              description: `Rental history for ${user.email}`,
              mimeType: 'application/json',
            })),
          };
        } catch {
          return { resources: [] };
        }
      },
    }),
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