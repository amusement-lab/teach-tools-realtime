export interface RoomCreatedResponse {
  id: string;
  message: string;
}

export enum UnderstandStatus {
  YES = "YES",
  NO = "NO",
  EMPTY = "EMPTY",
}

interface Client {
  id: string;
  understandStatus: UnderstandStatus;
}

export interface RoomMessage {
  id: string;
  info: string[];
  adminId: string;
  clients: Client[];
}
