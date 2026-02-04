import { Router } from 'express';
import { getEquipment, createEquipment, deleteEquipment, getEquipmentById, getRoomEquipment } from '../controllers/equipmentController.js';

const router = Router();

router.get('/', getEquipment);

router.post('/add', createEquipment);

router.get('/rooms/:id', getRoomEquipment);

router.get('/:id', getEquipmentById);

router.delete('/delete/:id', deleteEquipment);

export default router;