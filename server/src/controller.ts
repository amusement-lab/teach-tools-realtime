import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

interface Fact {
  source: string;
  info: string;
}

let clients: { id: number; response: Response }[] = [];
let facts: Fact[] = [];

interface Room {
  id: string;
  clients: { id: string; response: Response }[];
  info: string[];
}

const rooms: Room[] = [];

class TestController {
  static statusRoom(request: Request, response: Response) {
    const { roomId } = request.params;
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    const room = rooms[roomIndex];

    response.json({ ...room, clients: room.clients.length });
  }

  static createRoom(request: Request, response: Response) {
    const roomData = {
      id: uuid(),
      clients: [],
      info: [],
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

    response.write("data: " + JSON.stringify(room.info) + "\n\n");

    const newClient = {
      id: uuid(),
      response,
    };
    console.log(newClient);
    room.clients.push(newClient);

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
      client.response.write("data: " + JSON.stringify(room.info) + "\n\n")
    );
  }

  // LEGACY CODE and EXAMPLE
  static eventsHandler(request: Request, response: Response) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    response.writeHead(200, headers);

    const data = `data: ${JSON.stringify(facts)}\n\n`;
    response.write(data);

    const clientId = Date.now();
    const newClient = {
      id: clientId,
      response,
    };

    clients.push(newClient);

    request.on("close", () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter((client) => client.id !== clientId);
    });
  }

  static sendEventsToAll(newFact: Fact) {
    clients.forEach((client) =>
      client.response.write(`data: ${JSON.stringify(newFact)}\n\n`)
    );
  }

  static addFact(request: Request, response: Response) {
    const newFact = request.body;
    facts.push(newFact);
    response.json(newFact);
    return this.sendEventsToAll(newFact);
  }
}

export default TestController;
