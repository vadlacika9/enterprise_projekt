import { EquipmentRepository } from '../repositories/equipmentRepository.js';
import type { EquipmentData } from '../types/equipment.js';

const equipmentRepo = new EquipmentRepository();

export class EquipmentService {
  async getAllEquipment() {
    return await equipmentRepo.findAll();
  }

  async createEquipment(equipmentData: EquipmentData) {
    return await equipmentRepo.add(equipmentData);
  }

  async getEquipmentById(id: number) {
    const equipment = await equipmentRepo.findById(id);
    if (!equipment) throw new Error('Equipment not found');
    return equipment;
}

  async deleteEquipment(id: number) {
    const equipment = await this.getEquipmentById(id);
    return await equipmentRepo.delete(id);
  }

  async getRoomEquipments(roomId: number){
    const equipment = await equipmentRepo.findByRoomId(roomId);
    if (!equipment) throw new Error('Equipment not found');
    return equipment;
  }


}