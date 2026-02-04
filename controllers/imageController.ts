import type { Request, Response } from 'express';
import { ImageService } from '../services/imageService.js';

const imageService = new ImageService();

export const uploadRoomImage = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.id);
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Missing file' });

    const created = await imageService.uploadRoomImage(roomId, file);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listRoomImages = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.id);
    const images = await imageService.listRoomImages(roomId);
    res.status(200).json(images);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteRoomImage = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const imageId = Number(req.params.imageId);
    await imageService.deleteRoomImage(roomId, imageId);
    res.status(204).send('Image deleted successfully');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

