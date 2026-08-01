import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { getApiClient } from '../api/client';

export function registerTools(server: McpServer): void {

  server.registerTool(
    'listAvailableCars',
    {
      description: 'List cars available for rental within a date range, with optional filters',
      inputSchema: z.object({
        startDate: z.string().describe('ISO date string e.g. 2025-08-10'),
        endDate: z.string().describe('ISO date string e.g. 2025-08-12'),
        type: z.string().optional().describe('Car type filter e.g. SUV, Sedan'),
        maxPrice: z.number().optional().describe('Maximum daily price'),
      }),
    },
    async ({ startDate, endDate, type, maxPrice }, { sessionId }) => {
      const api = await getApiClient(sessionId);
      const params = { startDate, endDate, type, maxPrice };
      const { data } = await api.get('/cars', { params });
      const [cars, total] = data;

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ cars, total }),
        }],
      };
    },
  );

  server.registerTool(
    'bookCar',
    {
      description: 'Book a car for the authenticated user for a given date range',
      inputSchema: z.object({
        carId: z.string().uuid().describe('ID of the car to book'),
        startDate: z.string().describe('ISO date string for rental start'),
        endDate: z.string().describe('ISO date string for rental end'),
      }),
    },
    async ({ carId, startDate, endDate }, { sessionId }) => {
      const api = await getApiClient(sessionId);
      const { data } = await api.post('/rentals', { carId, startDate, endDate });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data),
        }],
      };
    },
  );

  server.registerTool(
    'cancelBooking',
    {
      description: 'Cancel (return) an active rental for the authenticated user',
      inputSchema: z.object({
        rentalId: z.string().uuid().describe('ID of the rental to cancel'),
      }),
    },
    async ({ rentalId }, { sessionId }) => {
      const api = await getApiClient(sessionId);
      const { data } = await api.patch(`/rentals/${rentalId}`);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data),
        }],
      };
    },
  );

  server.registerTool(
    'getUserTrips',
    {
      description: 'Get the rental history for the authenticated user',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number for pagination'),
        limit: z.number().optional().describe('Results per page'),
      }),
    },
    async ({ page, limit }, { sessionId }) => {
      const api = await getApiClient(sessionId);
      const { data } = await api.get('/rentals/history', {
        params: { page, limit },
      });
      const [rentals, total] = data;

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ rentals, total }),
        }],
      };
    },
  );
}