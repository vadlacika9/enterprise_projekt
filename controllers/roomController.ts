import { RoomService } from "../services/roomService.js";
import { type Request, type Response } from "express";
const roomService = new RoomService();

export const getRooms = async (req: Request, res:Response)  => {
    try{
        const rooms = await roomService.getAllRooms();
        res.status(200).json(rooms);
    }
    catch(error: any){
        res.status(500).json({error: error.message});

    }
}

export const getRoomById = async (req: Request, res:Response)  => {
    try{
        const id = Number(req.params.id);
        const room = await roomService.getRoomById(id);
        res.status(200).json(room);
    }
    catch(error: any){
        res.status(404).json({error: error.message});
    }
}

export const checkRoomAvailability = async (req: Request, res:Response)  => {
    try{
        const id = Number(req.params.id);
        const isAvailable = await roomService.checkAvailability(id);
        res.status(200).json({ is_available: isAvailable });
    }
    catch(error: any){
        res.status(404).json({error: error.message});
    }
}

export const getAvailableRooms = async (req: Request, res:Response)  => {
    try{
        const rooms = await roomService.getAllAvailableRooms();
        res.status(200).json(rooms);
    }
    catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export const addRoom = async (req: Request, res:Response)  => {
    try{
        const roomData = req.body;
        const newRoom = await roomService.createRoom(roomData);
        res.status(201).json(newRoom);
    }
    catch(error: any){
        res.status(500).json({error: error.message});
    }
}



export const deleteRoom = async (req: Request, res:Response)  => {
    try{
        const id = Number(req.params.id);
        await roomService.deleteRoom(id);
        res.status(204).send('Room deleted successfully');
    }
    catch(error: any){
        res.status(404).json({error: error.message});
    }
}

export const getRoomEquipment = async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.id);
        const equipment = await roomService.getRoomEquipment(roomId);
        res.status(200).json(equipment);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export const updateRoomAvailability = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { is_available } = req.body;
        const updatedRoom = await roomService.updateAvailability(id, is_available);
        res.status(200).json(updatedRoom);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export const addEquipmentToRoom = async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.roomId);
        const equipment_id  = Number(req.params.equipmentId);
        const { value } = req.body;
        const result = await roomService.addEquipment(roomId, equipment_id, value);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}