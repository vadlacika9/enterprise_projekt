export type CreateImageData = {
  room_id: number;
  url: string;
  pathname: string;
  contentType?: string | null;
  size?: number | null;
};