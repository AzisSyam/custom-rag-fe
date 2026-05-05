import axios from "axios";
import type { AuthResponse, LoginCredentials } from "../../domain/models/Auth";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import Cookies from "js-cookie";

export class ApiAuthRepository implements AuthRepository {
  private baseUrl = import.meta.env.PUBLIC_BASE_URL;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    try {
      const response = await axios.post<AuthResponse>(
        `${this.baseUrl}/api/login`,
        formData,
        {
          headers: {
            Accept: "application/json",
            // Axios will automatically set Content-Type to multipart/form-data when using FormData
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || "Login failed";
        throw new Error(message);
      }
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async logout(): Promise<void> {
    const token = Cookies.get("auth_token");

    try {
      await axios.post(
        `${this.baseUrl}/api/logout`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      // Tetap hapus token lokal meski request gagal (misal token sudah expired)
      console.error("[ApiAuthRepository] Logout request failed:", error?.response?.data || error?.message);
    } finally {
      Cookies.remove("auth_token");
      localStorage.removeItem("user");
    }
  }
}

