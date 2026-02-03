import { RoomRepository } from "../repositories/roomRepository.js";
import { EquipmentRepository } from "../repositories/equipmentRepository.js";
import type { RoomData, RoomEquipmentData } from "../types/roomType.js";

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

    async updateRoom(id: number, data: Partial<RoomData>) {
        const room = await roomRepo.findById(id);
        if (!room) throw new Error('Room not found');
        return await roomRepo.update(id, data);
    }

    async getRoomEquipment(roomId: number) {
        const room = await roomRepo.findById(roomId);
        if (!room) throw new Error('Room not found');
        return await equipmentRepo.findByRoomId(roomId);
    }

    async getRoomDetails(id: number) {
        const roomWithEquipment = await roomRepo.findDetailsById(id);
        if (!roomWithEquipment) throw new Error('Room not found');

        const { room_equipment, ...roomData } = roomWithEquipment;

        return {
            ...roomData,
            equipments: (room_equipment || []).map((re) => ({
                equipment_id: re.equipment.equipment_id,
                name: re.equipment.name,
                value: re.value
            })) as RoomEquipmentData[]
        };
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

    async removeEquipment(roomId: number, equipmentId: number) {
        const room = await roomRepo.findById(roomId);
        if (!room) throw new Error('Room not found');
        return await roomRepo.removeEquipment(roomId, equipmentId);
    }

}
