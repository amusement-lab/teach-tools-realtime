export interface Room {
  id: string;
  info: string[];
  admin: {
    id: string;
  };
  clients: string[];
}
