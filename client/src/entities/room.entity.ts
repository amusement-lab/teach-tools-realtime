export enum UnderstandStatus {
  YES = "YES",
  NO = "NO",
  EMPTY = "EMPTY",
}

export interface RoomClientMessage {
  clientId: string;
  name: string;
  info: string[];
  understandStatus: UnderstandStatus;
}
