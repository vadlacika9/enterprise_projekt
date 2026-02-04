import { prisma } from '../lib/prisma.js';
import type { CreateImageData } from '../types/image.ts';


export class ImageRepository {
  async create(data: CreateImageData) {
    return await prisma.image.createMany({ data });
  }

  async findByRoomId(roomId: number) {
    return await prisma.image.findMany({
      where: { room_id: roomId },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(imageId: number) {
    return await prisma.image.findUnique({
      where: { image_id: imageId }
    });
  }

  async delete(imageId: number) {
    return await prisma.image.delete({
      where: { image_id: imageId }
    });
  }
}

