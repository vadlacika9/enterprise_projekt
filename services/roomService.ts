import { RoomRepository } from "../repositories/roomRepository.js";
import { EquipmentRepository } from "../repositories/equipmentRepository.js";
import type { RoomData } from "../types/roomType.js";

const roomRepo = new RoomRepository();
const equipmentRepo = new EquipmentRepository();

export class RoomService {

    async getAllRooms() {
        return await roomRepo.findAll();
    }

    async getRoomById(id: number) {
        const room = await roomRepo.findById(id);
        if (!room) throw new Error('Room not found');
        return room;
    }

    async checkAvailability(id: number) {
        const availability = await roomRepo.isAvailable(id);
        if (availability === null) throw new Error('Room not found');
        return availability.is_available;
    }

    async getAllAvailableRooms() {
        return await roomRepo.allAvailable();
    }

    async createRoom(roomData: RoomData) {
        return await roomRepo.create(roomData);
    }

    async deleteRoom(id: number) {
        const room = await roomRepo.findById(id);
        if (!room) throw new Error('Room not found');
        return await roomRepo.delete(id);
    }

    async getRoomEquipment(roomId: number) {
        const room = await roomRepo.findById(roomId);
        if (!room) throw new Error('Room not found');
        return await equipmentRepo.findByRoomId(roomId);
    }

    async updateAvailability(id: number, isAvailable: number) {
        const room = await roomRepo.findById(id);
        if (!room) throw new Error('Room not found');
        return await roomRepo.updateAvailability(id, isAvailable);
    }

    async addEquipment(roomId: number, equipmentId: number, value: number) {
        const room = await roomRepo.findById(roomId);
        if (!room) throw new Error('Room not found');
        const equipment = await equipmentRepo.findAll().then(equipments =>
            equipments.find(eq => eq.equipment_id === equipmentId)
        );
        if (!equipment) throw new Error('Equipment not found');
        return await roomRepo.addEquipment(roomId, equipmentId, value);
    }

}
