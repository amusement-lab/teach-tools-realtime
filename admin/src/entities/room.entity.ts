export interface RoomCreatedResponse {
  id: string;
  message: string;
}

export enum UnderstandStatus {
  YES = 'YES',
  NO = 'NO',
  EMPTY = 'EMPTY',
}

export interface Client {
  id: string;
  name: string;
  understandStatus: UnderstandStatus;
}

export interface RoomMessage {
  id: string;
  info: string[];
  adminId: string;
  clients: Client[];
}

export interface RoomClientMessage {
  clientId: string;
  name: string;
  info: string[];
  understandStatus: UnderstandStatus;
}
