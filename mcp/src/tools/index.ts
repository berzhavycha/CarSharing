import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { getApiClient } from '../api/client';

export function registerTools(server: McpServer, oauthSessionId: string): void {

  server.registerTool(
    'listAvailableCars',
    {
      description: 'List cars available for rental with optional search and filters',
      inputSchema: z.object({
        search: z.string().optional().describe('Search by model name e.g. "Lada", "Toyota"'),
        types: z.array(z.string()).optional().describe('Car type filters e.g. ["SUV", "Sedan"]'),
        capacities: z.array(z.string()).optional().describe('Seat capacity filters e.g. ["4", "5"]'),
        status: z.string().optional().describe('Car status filter e.g. "available"'),
        minPrice: z.number().optional().describe('Minimum price per hour'),
        maxPrice: z.number().optional().describe('Maximum price per hour'),
        page: z.number().optional().describe('Page number for pagination'),
        limit: z.number().optional().describe('Results per page'),
      }),
    },
    async ({ search, types, capacities, status, minPrice, maxPrice, page, limit }) => {
      try {
        const api = await getApiClient(oauthSessionId);
        const { data } = await api.get('/cars', {
          params: { search, types, capacities, status, minPrice, maxPrice, page, limit },
        });
        const [cars, total] = data;

        return {
          content: [{ type: 'text', text: JSON.stringify({ cars, total }) }],
        };
      } catch (error: any) {
        const message = error.response?.data?.message ?? error.message;
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'bookCar',
    {
      description: 'Book a car for the authenticated user by specifying duration in hours and pickup/dropoff locations',
      inputSchema: z.object({
        carId: z.string().uuid().describe('UUID of the car to book'),
        hours: z.number().int().positive().describe('Number of hours to rent the car'),
        pickUpLocation: z.string().describe('Address or location name for pickup'),
        dropOffLocation: z.string().describe('Address or location name for drop-off'),
      }),
    },
    async ({ carId, hours, pickUpLocation, dropOffLocation }) => {
      const api = await getApiClient(oauthSessionId);
      try {
        const { data } = await api.post('/rentals', {
          carId,
          hours,
          pickUpLocation,
          dropOffLocation,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(data) }],
        };
      } catch (error: any) {
        const message = error.response?.data?.message ?? error.message;
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        };
      }
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
    async ({ rentalId }) => {
      try {
        const api = await getApiClient(oauthSessionId);
        const { data } = await api.patch(`/rentals/${rentalId}`);
  
        return {
          content: [{ type: 'text', text: JSON.stringify(data) }],
        };
      } catch (error: any) {
        const message = error.response?.data?.message ?? error.message;
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        };
      }
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
    async ({ page, limit }) => {
      try {
        const api = await getApiClient(oauthSessionId);
        const { data } = await api.get('/rentals/history', {
          params: { page, limit },
        });
        const [rentals, total] = data;
  
        return {
          content: [{ type: 'text', text: JSON.stringify({ rentals, total }) }],
        };
      } catch (error: any) {
        const message = error.response?.data?.message ?? error.message;
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        };
      }
    },
  );
}