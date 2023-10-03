import { useState } from "react";

enum UnderstandStatus {
  YES = "YES",
  NO = "NO",
  EMPTY = "EMPTY",
}

function Room() {
  const [facts, setFacts] = useState<string[]>([]);
  const [adminId, setAdminId] = useState<string>("");
  const [clients, setClients] = useState<{ id: string }[]>([]);
  const [listening, setListening] = useState(false);

  const roomId = localStorage.getItem("roomId");

  if (!listening) {
    const events = new EventSource(
      "http://localhost:3001/join-room-admin/" + roomId
    );

    events.onopen = (event) => {
      console.log(event);
    };

    events.onmessage = (event) => {
      console.log(event.data);

      const parsedData: {
        id: string;
        info: string[];
        adminId: string;
        clients: {
          id: string;
          understandStatus: UnderstandStatus;
        }[];
      } = JSON.parse(event.data);

      if (parsedData.adminId) {
        setAdminId(parsedData.adminId);
      }

      if (parsedData.clients) {
        setClients(parsedData.clients);
      }

      if (parsedData.info) {
        setFacts(parsedData.info);
      }
    };

    events.onerror = (evt) => {
      console.log(evt);
    };

    setListening(true);
  }

  // async function changeStatus() {
  //   console.log(roomId, clientId);
  //   const res = await fetch(
  //     `http://localhost:3001/change-understand-status/${roomId}/${clientId}/YES`,
  //     { method: "POST" }
  //   );
  //   const json = await res.json();
  //   console.log(json);
  // }

  return (
    <div>
      <div>{adminId}</div>

      {clients.map((client, i) => (
        <div key={i}>{client.id}</div>
      ))}

      {facts.map((fact, i) => (
        <div key={i}>{fact}</div>
      ))}
    </div>
  );
}

export default Room;
