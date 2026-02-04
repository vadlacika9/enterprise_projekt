import { put, del } from '@vercel/blob';
import { ImageRepository } from '../repositories/imageRepository.js';
import { RoomRepository } from '../repositories/roomRepository.js';

const imageRepo = new ImageRepository();
const roomRepo = new RoomRepository();

function requireBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('Missing BLOB_READ_WRITE_TOKEN');
  return token;
}

export class ImageService {
  async uploadRoomImages(roomId: number, files: Express.Multer.File[]) {
    // 1. Szoba ellenőrzése
    const room = await roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');

    const token = requireBlobToken();

    // 2. Minden fájlra lefuttatjuk a feltöltést párhuzamosan
    const uploadPromises = files.map(async (file) => {
      const safeName = file.originalname?.replace(/[^\w.\-]+/g, '_') || 'upload';
      const blobPath = `rooms/${roomId}/${Date.now()}-${safeName}`;

      // Feltöltés a Vercel Blob-ba
      const blob = await put(blobPath, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        token
      });

      // Adatbázis mentés az imageRepository-val
      return await imageRepo.create({
        room_id: roomId,
        url: blob.url,
        pathname: blob.pathname,
        contentType: file.mimetype,
        size: file.size
      });
    });

    // Megvárjuk, amíg az összes feltöltés és mentés befejeződik
    return await Promise.all(uploadPromises);
  }

  async listRoomImages(roomId: number) {
    const room = await roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');
    return await imageRepo.findByRoomId(roomId);
  }

  async deleteRoomImage(roomId: number, imageId: number) {
    const room = await roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');

    const img = await imageRepo.findById(imageId);
    if (!img || img.room_id !== roomId) throw new Error('Image not found');

    const token = requireBlobToken();
    await del(img.url, { token });
    return await imageRepo.delete(imageId);
  }
}

