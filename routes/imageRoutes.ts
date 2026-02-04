import { Router } from 'express';
import { deleteRoomImage, listRoomImages } from '../controllers/imageController.js';

const router = Router();


router.get('/:id/images', listRoomImages);
router.delete('/:roomId/images/:imageId', deleteRoomImage);

export default router;

