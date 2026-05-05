import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export class LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
