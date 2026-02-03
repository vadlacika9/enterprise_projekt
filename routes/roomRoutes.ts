import { Router } from 'express';
import { addRoom, getRoomById, getRooms, checkRoomAvailability, getAvailableRooms, deleteRoom, getRoomEquipment, updateRoomAvailability, addEquipmentToRoom } from '../controllers/roomController.js';

const router = Router();

router.get('/', getRooms);

router.post('/add', addRoom);

router.get('/:id/availability', checkRoomAvailability);

router.get('/available', getAvailableRooms);

router.delete('/delete/:id', deleteRoom);

router.get('/:id', getRoomById);

router.get('/:id/equipment', getRoomEquipment);

router.put('/:id/availability', updateRoomAvailability);

router.post('/:roomId/:equipmentId', addEquipmentToRoom);

export default router;