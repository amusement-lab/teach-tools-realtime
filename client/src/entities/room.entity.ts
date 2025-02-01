export interface RoomCreatedResponse {
  roomId: string;
  adminId: string;
  message: string;
}

export enum UnderstandStatus {
  YES = "YES",
  NO = "NO",
  EMPTY = "EMPTY",
}

export interface Client {
  id: string;
  name: string;
  understandStatus: UnderstandStatus;
}

export interface RoomMessage {
  id: string;
  adminId: string;
  info: string[];
  clients: Client[];
  message?: string;
}

export interface JoinClientRoom {
  id: string;
}

export interface RoomClientMessage {
  id: string;
  name: string;
  info: string[];
  understandStatus: UnderstandStatus;
  message?: string;
}
