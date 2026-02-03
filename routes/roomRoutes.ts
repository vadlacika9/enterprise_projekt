import { Router } from 'express';
import { addRoom, getRoomById, getRooms, getAvailableRooms, deleteRoom, getRoomEquipment, addEquipmentToRoom, getRoomDetails, updateRoom, removeEquipmentFromRoom, checkRoomAvailability } from '../controllers/roomController.js';

const router = Router();

router.get('/', getRooms);

router.post('/add', addRoom);

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