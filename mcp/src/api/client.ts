import axios, { AxiosInstance } from 'axios';
import { getAccessToken } from '../auth/oauth-session';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000';

/**
 * Returns an axios instance with the Authorization header
 * pre-filled for the given session's access token.
 *
 * Called inside every tool handler — sessionId comes from MCP request context.
 */
export async function getApiClient(sessionId: string): Promise<AxiosInstance> {
  console.log('sessionId:', sessionId); 
  const accessToken = await getAccessToken(sessionId);

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}
