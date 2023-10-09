import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

interface Fact {
  source: string;
  info: string;
}

let clients: { id: number; response: Response }[] = [];
let facts: Fact[] = [];

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
    response?: Response;
  };
  clients: {
    id: string;
    name: string;
    response: Response;
    understandStatus: UnderstandStatus;
  }[];
}

const rooms: Room[] = [];

class TestController {
  static statusRoom(request: Request, response: Response) {
    const { roomId } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    if (room) {
      const roomClients = room.clients.map((client) => ({
        id: client.id,
        understandStatus: client.understandStatus,
      }));

      response.json({
        id: room.id,
        adminId: room.admin.id,
        clients: roomClients,
        info: room.info,
      });
    } else if (!room) {
      response.status(404).json({
        message: "Room not found",
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
      .json({ id: roomData.id, message: "Success create room" });
  }

  static joinRoom(request: Request, response: Response) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const { roomId, name } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    const newClient = {
      id: uuid(),
      name,
      response,
      understandStatus: UnderstandStatus.EMPTY,
    };

    response.write(
      "data: " +
        JSON.stringify({
          info: room.info,
          name: newClient.name,
          clientId: newClient.id,
          understandStatus: UnderstandStatus.EMPTY,
        }) +
        "\n\n"
    );

    room.clients.push(newClient);

    const roomClients = room.clients.map((client) => ({
      id: client.id,
      name: client.name,
      understandStatus: client.understandStatus,
    }));

    if (room.admin.response) {
      room.admin.response?.write(
        "data: " +
          JSON.stringify({
            clients: roomClients,
          }) +
          "\n\n"
      );
    }

    request.on("close", () => {
      console.log(`${newClient.id} connection closed`);
      room.clients = room.clients.filter(
        (client) => client.id !== newClient.id
      );
    });
  }

  static addInfo(request: Request, response: Response) {
    const { roomId } = request.params;
    const { info } = request.body;

    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    room.info.push(info);
    response.status(200).json({ roomId, info });

    room.clients.forEach((client) =>
      client.response.write(
        "data: " + JSON.stringify({ info: room.info }) + "\n\n"
      )
    );

    room.admin.response?.write(
      "data: " + JSON.stringify({ info: room.info }) + "\n\n"
    );
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

    // Update for admin page
    const roomClients = room.clients.map((client) => ({
      id: client.id,
      name: client.name,
      understandStatus: client.understandStatus,
    }));

    if (room.admin.response) {
      room.admin.response?.write(
        "data: " +
          JSON.stringify({
            clients: roomClients,
          }) +
          "\n\n"
      );
    }
  }

  static joinRoomAdmin(request: Request, response: Response) {
    const { roomId } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    if (room) {
      const headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      };
      response.writeHead(200, headers);

      const admin = {
        id: uuid(),
        response,
      };

      room.admin = admin;

      // Update for admin page
      const roomClients = room.clients.map((client) => ({
        id: client.id,
        name: client.name,
        understandStatus: client.understandStatus,
      }));

      response.write(
        "data: " +
          JSON.stringify({
            id: room.id,
            adminId: room.admin.id,
            info: room.info,
            clients: roomClients,
          }) +
          "\n\n"
      );

      request.on("close", () => {
        console.log(`Admin ${admin.id} connection closed`);
        room.clients = room.clients.filter((client) => client.id !== admin.id);
      });
    } else {
      response.json({ message: "Room is not found" });
      request.on("close", () => {
        console.log(`${roomId} is not found, connection closed`);
      });
    }
  }

  static resetAllUnderstandStatus(request: Request, response: Response) {
    const { roomId } = request.params;

    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    room.clients.forEach(
      (client) => (client.understandStatus = UnderstandStatus.EMPTY)
    );

    // Update for client page
    room.clients.forEach((client) =>
      client.response.write(
        "data: " +
          JSON.stringify({ understandStatus: client.understandStatus }) +
          "\n\n"
      )
    );

    // Update for admin page
    const roomClients = room.clients.map((client) => ({
      id: client.id,
      name: client.name,
      understandStatus: client.understandStatus,
    }));

    if (room.admin.response) {
      room.admin.response?.write(
        "data: " +
          JSON.stringify({
            clients: roomClients,
          }) +
          "\n\n"
      );
    }
  }
}

export default TestController;
