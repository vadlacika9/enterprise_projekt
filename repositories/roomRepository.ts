import { prisma } from '../lib/prisma.js';
import type { RoomData } from '../types/room.ts';

export class RoomRepository {

    async findAll() {
        return await prisma.room.findMany({
            include:{
                images: true
            }
        });
    }

    async findById(id: number) {
        return await prisma.room.findUnique({
            where: { room_id: id }
        });
    }

    async findDetailsById(id: number) {
        return await prisma.room.findUnique({
            where: { room_id: id },
            include: {
                room_equipment: {
                    include: {
                        equipment: true
                    }
                }
            }
        });
    }

    async isAvailable(id: number) {
        return await prisma.room.findUnique({
            where: { room_id: id },
            select: { is_available: true }
        });
    }

    async allAvailable() {
        return await prisma.room.findMany({
            where: { is_available: 1 }
        });
    }

    async create(roomData: RoomData) {
        console.log("roomdata:" + roomData)
        return await prisma.room.create({
            data: roomData
        });
    }

    async addMultipleEquipments(roomId: number, equipmentIds: number[]) {
        console.log("ids:"+equipmentIds)
    return await prisma.room_equipment.createMany({
        data: equipmentIds.map((id) => ({
            room_id: roomId,
            equipment_id: id,
            value: 1,
        })),
        skipDuplicates: true,
    });
}


    async delete(id: number) {
        return await prisma.room.delete({
            where: { room_id: id }
        });
    }

    async update(id: number, data: Partial<RoomData>) {
        return await prisma.room.update({
            where: { room_id: id },
            data
        });
    }

    async addEquipment(roomId: number, equipmentId: number, value: number) {
        return await prisma.room_equipment.create({
            data: {
                room_id: roomId,
                equipment_id: equipmentId,
                value: value
            }
        });
    }

    async removeEquipment(roomId: number, equipmentId: number) {
        return await prisma.room_equipment.delete({
            where: {
                room_id_equipment_id: {
                    room_id: roomId,
                    equipment_id: equipmentId
                }
            }
        });
    }

}