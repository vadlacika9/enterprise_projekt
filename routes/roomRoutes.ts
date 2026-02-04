import { Router } from 'express';
import multer from 'multer';
import { addRoom, getRoomById, getRooms, getAvailableRooms, deleteRoom, getRoomEquipment, addEquipmentToRoom, getRoomDetails, updateRoom, removeEquipmentFromRoom, checkRoomAvailability } from '../controllers/roomController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', getRooms);

router.post('/add', authenticateToken, upload.array('images', 10), addRoom);

router.put('/:id', updateRoom);

router.get('/:id/availability', checkRoomAvailability);

router.get('/available', getAvailableRooms);

router.delete('/delete/:id', deleteRoom);

router.get('/:id/details', getRoomDetails);

router.get('/:id', getRoomById);

router.get('/:id/equipment', getRoomEquipment);

router.post('/:roomId/:equipmentId', addEquipmentToRoom);

router.delete('/:roomId/equipment/:equipmentId', removeEquipmentFromRoom);

export default router;
