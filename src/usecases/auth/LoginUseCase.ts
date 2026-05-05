import type { AuthResponse, LoginCredentials } from "../../domain/models/Auth";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.authRepository.login(credentials);
  }
}
