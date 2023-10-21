import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

interface Fact {
  source: string;
  info: string;
}

let clients: { id: number; response: Response }[] = [];
let facts: Fact[] = [];

enum UnderstandStatus {
  YES = 'YES',
  NO = 'NO',
  EMPTY = 'EMPTY',
}

interface Room {
  id: string;
  info: string[];
  admin: {
    id: string;
  };
  clients: {
    id: string;
    name: string;
    understandStatus: UnderstandStatus;
  }[];
}

const rooms: Room[] = [];

class TestController {
  static statusAdminRoom(request: Request, response: Response) {
    const { roomId } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    if (room) {
      response.json({
        id: room.id,
        adminId: room.admin.id,
        info: room.info,
        clients: room.clients,
      });
    } else if (!room) {
      response.status(404).json({
        message: 'Room not found',
      });
    }
  }

  static statusClientRoom(request: Request, response: Response) {
    const { roomId, clientId, name } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    if (room) {
      const client = room.clients.findIndex((client) => client.id === clientId);
      response.json({ ...room.clients[client], info: room.info });
    } else if (!room) {
      response.status(404).json({
        message: 'Room not found',
      });
    }
  }

  static joinClientRoom(request: Request, response: Response) {
    const { roomId, name } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    if (room) {
      const newClient = {
        id: uuid(),
        name,
        understandStatus: UnderstandStatus.EMPTY,
      };

      room.clients.push(newClient);

      response.json({ ...newClient, info: room.info });
    } else if (!room) {
      response.status(404).json({
        message: 'Room not found',
      });
    }
  }

  static createRoom(request: Request, response: Response) {
    const roomData = {
      id: uuid(),
      info: [],
      admin: {
        id: uuid(),
      },
      clients: [],
    };
    rooms.push(roomData);
    response
      .status(201)
      .json({ id: roomData.id, message: 'Success create room' });
  }

  static addInfo(request: Request, response: Response) {
    const { roomId } = request.params;
    const { info } = request.body;

    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    room.info.push(info);

    response.status(200).json({ message: 'Info received' });
  }

  static changeUnderstandStatus(request: Request, response: Response) {
    const { roomId, clientId, understandStatus } = request.params;

    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];
    const clientIndex = room.clients.findIndex(
      (client) => client.id === clientId
    );
    const client = room.clients[clientIndex];

    client.understandStatus = understandStatus as UnderstandStatus;

    response.status(200).json({ message: 'Status changed' });
  }

  static resetAllUnderstandStatus(request: Request, response: Response) {
    const { roomId } = request.params;

    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    room.clients.forEach(
      (client) => (client.understandStatus = UnderstandStatus.EMPTY)
    );

    response.status(200).json({ message: 'Success reset all status' });
  }
}

export default TestController;
