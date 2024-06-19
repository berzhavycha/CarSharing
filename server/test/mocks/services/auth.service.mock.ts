export const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  refreshAccessToken: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  setTokensCookies: jest.fn(),
  clearTokensCookies: jest.fn(),
};
