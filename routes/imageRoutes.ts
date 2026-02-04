import { Router } from 'express';
import multer from 'multer';
import { deleteRoomImage, listRoomImages, uploadRoomImage } from '../controllers/imageController.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.get('/:id/images', listRoomImages);
router.post('/:id/images', upload.single('file'), uploadRoomImage);
router.delete('/:roomId/images/:imageId', deleteRoomImage);

export default router;

