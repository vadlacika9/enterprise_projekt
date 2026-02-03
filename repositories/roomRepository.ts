import {prisma} from '../lib/prisma.js';
import type { RoomData } from '../types/roomType.js';

export class RoomRepository {

    async findAll() {
        return await prisma.room.findMany();
    }

    async findById(id: number) {
        return await prisma.room.findUnique({
        where: { room_id: id }
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

    async create(roomData:RoomData){
        return await prisma.room.create({
            data: roomData
        });
    }

    async delete(id:number){
        return await prisma.room.delete({
            where: { room_id: id }
        });
    }

    async updateAvailability(id:number, is_available:number){
        return await prisma.room.update({
            where: { room_id: id },
            data: { is_available: is_available }
        });
    }

    async addEquipment(roomId:number, equipmentId:number, value:number) {
        return await prisma.room_equipment.create({
            data: {
                room_id: roomId,
                equipment_id: equipmentId,
                value: value
            }
        });
    }

}