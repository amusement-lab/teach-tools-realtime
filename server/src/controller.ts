import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

enum UnderstandStatus {
  YES = "YES",
  NO = "NO",
  EMPTY = "EMPTY",
}

interface Room {
  id: string;
  info: string[];
  admin: {
    id: string;
    response: Response | null;
  };
  clients: {
    id: string;
    name: string;
    understandStatus: UnderstandStatus;
    response: Response | null;
  }[];
}

const rooms: Room[] = [];

class TestController {
  static findRoom(roomId: string): Room {
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    return rooms[roomIndex];
  }

  static createRoom(request: Request, response: Response) {
    const room = {
      id: uuid(),
      info: [],
      admin: {
        id: uuid(),
        response: null,
      },
      clients: [],
    };

    rooms.push(room);

    response.status(201).json({
      adminId: room.admin.id,
      roomId: room.id,
      message: "Success create room",
    });
  }

  static addInfo(request: Request, response: Response) {
    const { roomId } = request.params;
    const { info } = request.body;

    const room = TestController.findRoom(roomId);

    room.info.push(info);

    room.admin.response?.write(
      `data: ${JSON.stringify({ info: room.info })}\n\n`
    );

    room.clients.forEach((client) => {
      client.response?.write(
        `data: ${JSON.stringify({ info: room.info })}\n\n`
      );
    });

    response.status(200).json({ message: "Info received" });
  }

  static statusAdminRoom(request: Request, response: Response) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const { roomId, adminId } = request.params;

    const room = TestController.findRoom(roomId);

    if (room.admin.id !== adminId) {
      response.status(403).json({
        message: "Unauthorized",
      });
    }

    room.admin.response = response;
    console.log(`Connection Admin with ID: ${room.admin.id} is opened`);

    const roomData = {
      id: room.id,
      adminId: room.admin.id,
      info: room.info,
      clients: room.clients.map((client) => ({
        clientId: client.id,
        name: client.name,
        understandStatus: client.understandStatus,
      })),
    };

    if (room) {
      response.write(`data: ${JSON.stringify(roomData)}\n\n`);
    } else if (!room) {
      response.status(404).json({
        message: "Room not found",
      });
    }

    request.on("close", () => {
      console.log(`Connection Admin with ID: ${room.admin.id} is closed`);
      room.admin.response = null;
    });
  }

  static statusClientRoom(request: Request, response: Response) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const { roomId, clientId } = request.params;

    const room = TestController.findRoom(roomId);
    const client = room.clients.findIndex((client) => client.id === clientId);
    room.clients[client].response = response;
    console.log(`Connection Client with ID: ${clientId} is opened`);

    if (room && room.clients[client]) {
      response.write(
        `data: ${JSON.stringify({
          clientId: room.clients[client].id,
          name: room.clients[client].name,
          understandStatus: room.clients[client].understandStatus,
          info: room.info,
        })}\n\n`
      );
    } else if (!room) {
      response.status(404).json({
        message: "Room not found",
      });
    } else if (!room.clients[client]) {
      response.status(404).json({
        message: "Client not found",
      });
    }

    request.on("close", () => {
      console.log(`Connection Client with ID: ${room.admin.id} is closed`);
      room.clients = room.clients.filter((client) => client.id !== clientId);
      const roomData = {
        clients: room.clients.map((client) => ({
          clientId: client.id,
          name: client.name,
          understandStatus: client.understandStatus,
        })),
      };
      room.admin.response?.write(`data: ${JSON.stringify(roomData)}\n\n`);
    });
  }

  static joinClientRoom(request: Request, response: Response) {
    const { roomId, name } = request.params;

    const room = TestController.findRoom(roomId);

    if (room) {
      const newClient = {
        id: uuid(),
        name,
        understandStatus: UnderstandStatus.EMPTY,
        response: null,
      };

      room.clients.push(newClient);
      response.json({ ...newClient, info: room.info });

      const roomData = {
        id: room.id,
        adminId: room.admin.id,
        info: room.info,
        clients: room.clients.map((client) => ({
          clientId: client.id,
          name: client.name,
          understandStatus: client.understandStatus,
        })),
      };
      room.admin.response?.write(`data: ${JSON.stringify(roomData)}\n\n`);
    } else if (!room) {
      response.status(404).json({
        message: "Room not found",
      });
    }
  }

  static changeUnderstandStatus(request: Request, response: Response) {
    const { roomId, clientId, understandStatus } = request.params;

    const room = TestController.findRoom(roomId);

    const clientIndex = room.clients.findIndex(
      (client) => client.id === clientId
    );
    const client = room.clients[clientIndex];

    client.understandStatus = understandStatus as UnderstandStatus;

    const roomData = {
      id: room.id,
      adminId: room.admin.id,
      info: room.info,
      clients: room.clients.map((client) => ({
        clientId: client.id,
        name: client.name,
        understandStatus: client.understandStatus,
      })),
    };
    room.admin.response?.write(`data: ${JSON.stringify(roomData)}\n\n`);

    response.status(200).json({ message: "Status changed" });
  }

  static resetAllUnderstandStatus(request: Request, response: Response) {
    const { roomId } = request.params;

    const room = TestController.findRoom(roomId);

    room.clients.forEach((client) => {
      client.understandStatus = UnderstandStatus.EMPTY;
      client.response?.write(
        `data: ${JSON.stringify({
          understandStatus: client.understandStatus,
        })}\n\n`
      );
    });

    const roomData = {
      clients: room.clients.map((client) => ({
        clientId: client.id,
        name: client.name,
        understandStatus: client.understandStatus,
      })),
    };
    room.admin.response?.write(`data: ${JSON.stringify(roomData)}\n\n`);

    response.status(200).json({ message: "Success reset all status" });
  }
}

class AdminController {}

export default TestController;
