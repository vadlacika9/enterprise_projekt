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

}