import type { Request, Response } from 'express';
import { ImageService } from '../services/imageService.js';

const imageService = new ImageService();

// imageController.js
export const uploadRoomImage = async (req :Request, res:Response) => {
   try {
    const { id } = req.params;

  // Ellenőrizzük, hogy létezik-e és string-e
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: "Invalid or missing Room ID" });
  }

  const roomId = parseInt(id, 10);

  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Room ID must be a number" });
  }
    
    // TypeScript kényszerítés: a req.files Multer fájlok tömbje lesz
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    // A Service-nek közvetlenül a tömböt adjuk át
    const createdImages = await imageService.uploadRoomImages(roomId, files);

    res.status(201).json(createdImages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

