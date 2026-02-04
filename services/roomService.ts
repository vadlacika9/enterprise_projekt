import { RoomRepository } from "../repositories/roomRepository.js";
import { EquipmentRepository } from "../repositories/equipmentRepository.js";
import type { RoomData, RoomEquipmentData } from "../types/room.ts";
import { prisma } from "../lib/prisma.js";
import { put, del } from '@vercel/blob';

const roomRepo = new RoomRepository();
const equipmentRepo = new EquipmentRepository();

function requireBlobToken() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) throw new Error('Missing BLOB_READ_WRITE_TOKEN');
    return token;
}

export class RoomService {

    async getAllRooms() {
        return (await roomRepo.findAll());
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

    async createRoomWithImages(
        roomData: RoomData,
        selectedEquipments: number[],
        files: Express.Multer.File[]
    ) {
        const uploadedBlobs: Array<{ url: string; pathname: string; contentType: string; size: number }> = [];
        const token = requireBlobToken();

        try {
            const result = await prisma.$transaction(async (tx) => {
                const newRoom = await tx.room.create({ data: roomData });

                if (selectedEquipments.length > 0) {
                    await tx.room_equipment.createMany({
                        data: selectedEquipments.map((id) => ({
                            room_id: newRoom.room_id,
                            equipment_id: id,
                            value: 1
                        })),
                        skipDuplicates: true
                    });
                }

                for (const file of files) {
                    const safeName = file.originalname?.replace(/[^\w.\-]+/g, '_') || 'upload';
                    const blobPath = `rooms/${newRoom.room_id}/${Date.now()}-${safeName}`;
                    const blob = await put(blobPath, file.buffer, {
                        access: 'public',
                        contentType: file.mimetype,
                        token
                    });
                    uploadedBlobs.push({
                        url: blob.url,
                        pathname: blob.pathname,
                        contentType: file.mimetype,
                        size: file.size
                    });
                }

                if (uploadedBlobs.length > 0) {
                    await tx.image.createMany({
                        data: uploadedBlobs.map((img) => ({
                            room_id: newRoom.room_id,
                            url: img.url,
                            pathname: img.pathname,
                            contentType: img.contentType,
                            size: img.size
                        }))
                    });
                }

                return newRoom;
            });

            return result;
        } catch (error) {
            try {
                const token = process.env.BLOB_READ_WRITE_TOKEN;
                if (token) {
                    for (const img of uploadedBlobs) {
                        await del(img.url, { token });
                    }
                }
            } catch {}
            throw error;
        }
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
