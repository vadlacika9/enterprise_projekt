import { UserRepository } from '../repositories/userRepository.js';

const userRepo = new UserRepository();

export class UserService {
  async getAllUsers() {
    return await userRepo.findAll();
  }

  async getUserById(id: number) {
    const user = await userRepo.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
}