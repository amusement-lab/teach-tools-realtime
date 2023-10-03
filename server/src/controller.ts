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
    response.status(201).json(roomData);
  }

  static joinRoom(request: Request, response: Response) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const { roomId } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    const newClient = {
      id: uuid(),
      response,
      understandStatus: UnderstandStatus.EMPTY,
    };

    response.write(
      "data: " +
        JSON.stringify({
          info: room.info,
          clientId: newClient.id,
          understandStatus: UnderstandStatus.EMPTY,
        }) +
        "\n\n"
    );

    console.log(room);

    room.clients.push(newClient);

    const roomClients = room.clients.map((client) => ({
      id: client.id,
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

    response.send("ok");
    // Update to the admin here
    // room.clients.forEach((client) =>
    //   client.response.write("data: " + JSON.stringify(room.info) + "\n\n")
    // );
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

      const roomClients = room.clients.map((client) => ({
        id: client.id,
        understandStatus: client.understandStatus,
      }));

      response.write(
        "data: " +
          JSON.stringify({
            id: room.id,
            info: room.info,
            adminId: room.admin.id,
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
}

export default TestController;
