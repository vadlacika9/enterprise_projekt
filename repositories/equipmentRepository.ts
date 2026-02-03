import {prisma} from '../lib/prisma.js';
import type { EquipmentData } from '../types/equipment.js';

export class EquipmentRepository {

    async findAll() {
        return await prisma.equipment.findMany();
    }

    async add(data: EquipmentData) {
        return await prisma.equipment.create({
            data: data
        });
    }

    async findById(id: number) {
        return await prisma.equipment.findUnique({
            where: { equipment_id: id }
        });
    }

    async delete(id: number) {
        return await prisma.equipment.delete({
            where: { equipment_id: id }
        });
    }

    async findByRoomId(roomId: number) {
        return await prisma.room_equipment.findMany({
            where: { room_id: roomId },
            include: {
                equipment: true
            }
        });
    }

}