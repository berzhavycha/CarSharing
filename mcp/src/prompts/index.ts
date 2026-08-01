import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

export function registerPrompts(server: McpServer): void {

  server.registerPrompt(
    'find-nearby-car',
    {
      description: 'Help the user find an available car near a location for a given time period',
      argsSchema: z.object({
        location: z.string().describe('City or address e.g. "Lviv, Ukraine"'),
        date: z.string().describe('Rental date e.g. "2025-08-10"'),
        durationHours: z.string().describe('How many hours e.g. "3"'),
      }),
    },
    ({ location, date, durationHours }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text:
            `Find me an available car near ${location} on ${date} for ${durationHours} hours. ` +
            `Use the listAvailableCars tool to check availability. ` +
            `Show me the options sorted by price from cheapest to most expensive, ` +
            `including car type, capacity, and daily rate for each option.`,
        },
      }],
    }),
  );

  server.registerPrompt(
    'estimate-trip-cost',
    {
      description: 'Estimate the total cost of renting a specific car for a date range',
      argsSchema: z.object({
        carId: z.string().describe('UUID of the car'),
        startDate: z.string().describe('Start date e.g. "2025-08-10"'),
        endDate: z.string().describe('End date e.g. "2025-08-12"'),
      }),
    },
    ({ carId, startDate, endDate }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text:
            `Estimate the total rental cost for car ${carId} from ${startDate} to ${endDate}. ` +
            `Fetch the car details using the car:///${carId} resource. ` +
            `Calculate: number of days × daily rate. ` +
            `Return a cost breakdown showing daily rate, number of days, and total amount.`,
        },
      }],
    }),
  );
}
