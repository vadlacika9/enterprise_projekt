import { type Request, type Response } from 'express';
import { EquipmentService } from '../services/equipmentService.js';

const equipmentService = new EquipmentService();

export const getEquipment = async (req: Request, res: Response) => {
  try {
    const equipment = await equipmentService.getAllEquipment();
    res.status(200).json(equipment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoomEquipment = async(req: Request, res: Response) => {
  try{
     const roomId = Number(req.params.id);
     console.log("roomid:", roomId)
    const equipment = await equipmentService.getRoomEquipments(roomId);
    res.status(200).json(equipment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
  }



export const createEquipment = async (req: Request, res: Response) => {
  try {
    const equipmentData = req.body;
    const newEquipment = await equipmentService.createEquipment(equipmentData);
    res.status(201).json(newEquipment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const equipment = await equipmentService.getEquipmentById(id);
    res.status(200).json(equipment);
    } catch (error: any) {
    res.status(404).json({ error: error.message });
    }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await equipmentService.deleteEquipment(id);
    res.status(204).send('Equipment deleted successfully');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

