export interface RoleResponse {
  id: string;
  name: string;
}

export interface ApiAuthResponse {
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  role: RoleResponse;
  createdAt: string;
  updatedAt: string;
  id: string;
}
