import { RoomService } from "../services/roomService.js";
import { type Request ,type Response } from "express";
import { type AuthRequest } from '../middlewares/authMiddleware.js';
const roomService = new RoomService();

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(200).json(rooms);
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });

    }
}


export const addRoom = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No images provided" });
        }

        const roomData = req.body as Record<string, any>;

        let selectedEquipments: number[] = [];
        const raw = roomData.selectedEquipments;

        if (Array.isArray(raw)) {
            selectedEquipments = raw.map(Number);
        } else if (typeof raw === 'string') {
            try {
                selectedEquipments = JSON.parse(raw).map(Number);
            } catch {
                selectedEquipments = raw.split(',').map(Number);
            }
        }

        const finalRoomData = {
            title: roomData.title,
            city: roomData.city,
            postal_code: roomData.postal_code,
            street: roomData.street,
            adress_number: roomData.adress_number,
            room_number: roomData.room_number,
            capacity: Number(roomData.capacity),
            hourly_price: Number(roomData.hourly_price),
            description: roomData.description,
            user_id: userId,
            is_available: 1,
        };

        const newRoom = await roomService.createRoomWithImages(finalRoomData, selectedEquipments, files);
        res.status(201).json(newRoom);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const room = await roomService.getRoomById(id);
        res.status(200).json(room);
    }
    catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export const checkRoomAvailability = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const isAvailable = await roomService.checkAvailability(id);
        res.status(200).json({ is_available: isAvailable });
    }
    catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export const getAvailableRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await roomService.getAllAvailableRooms();
        res.status(200).json(rooms);
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}




export const updateRoom = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const roomData = req.body;
        const updatedRoom = await roomService.updateRoom(id, roomData);
        res.status(200).json(updatedRoom);
    }
    catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}


export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await roomService.deleteRoom(id);
        res.status(204).send('Room deleted successfully');
    }
    catch (error: any) {
        res.status(404).json({ error: error.message });
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

export const getRoomDetails = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const roomDetails = await roomService.getRoomDetails(id);
        res.status(200).json(roomDetails);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export const addEquipmentToRoom = async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.roomId);
        const equipment_id = Number(req.params.equipmentId);
        const { value } = req.body;
        const result = await roomService.addEquipment(roomId, equipment_id, value);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export const removeEquipmentFromRoom = async (req: Request, res: Response) => {
    try {
        const roomId = Number(req.params.roomId);
        const equipment_id = Number(req.params.equipmentId);
        await roomService.removeEquipment(roomId, equipment_id);
        res.status(204).send('Equipment removed from room successfully');
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}
