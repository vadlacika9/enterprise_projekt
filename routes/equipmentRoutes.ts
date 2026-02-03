import { Router } from 'express';
import { getEquipment, createEquipment, deleteEquipment, getEquipmentById } from '../controllers/equipmentController.js';

const router = Router();

router.get('/', getEquipment);

router.post('/add', createEquipment);

router.get('/:id', getEquipmentById);

router.delete('/delete/:id', deleteEquipment);

export default router;