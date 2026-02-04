export type RoomData = {
  city: string,
  street: string,
  adress_number: string,
  postal_code: string,
  capacity: number,
  is_available: number,
  hourly_price: number,
  room_number: string,
  title: string,
  description: string,
  user_id: number,
  selectedEquipments?: number[],
  image?: {
    url: string;
    pathname: string;
    contentType?: string;
    size?: number;
  }[];
};

export type RoomEquipmentData = {
  equipment_id: number,
  name: string,
  value: number,
};
