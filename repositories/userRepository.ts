import { prisma } from '../lib/prisma.js'


export class UserRepository {
  async findAll() {
    return await prisma.users.findMany();
  }

  async findById(id: number) {
    return await prisma.users.findUnique({
      where: { user_id: id }
    });
  }

  async findByEmail(email: string) {
    return await prisma.users.findUnique({
      where: { email: email }
    });
  }

  async create(userData: any) {
    return await prisma.users.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        role: userData.role,
      }
    });
  }
}