import type { AuthResponse, LoginCredentials } from "../models/Auth";

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
}
