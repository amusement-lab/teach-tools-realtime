import { useState } from "react";
import { RoomClientMessage } from "../../entities/room.entity";

enum UnderstandStatus {
  YES = "YES",
  NO = "NO",
  EMPTY = "EMPTY",
}

function App() {
  const [facts, setFacts] = useState<string[]>([]);
  const [understandStatus, setUnderstandStatus] = useState<UnderstandStatus>(
    UnderstandStatus.EMPTY
  );
  const [clientId, setClientId] = useState<string>("");
  const [listening, setListening] = useState(false);

  const roomId = localStorage.getItem("roomId");
  const name = localStorage.getItem("name");

  if (!listening) {
    const events = new EventSource(
      `http://localhost:3001/join-room/${roomId}/${name}`
    );

    events.onopen = (evt) => {
      console.log(evt);
    };

    events.onmessage = (event) => {
      console.log(event.data);

      const parsedData: RoomClientMessage = JSON.parse(event.data);

      if (parsedData.clientId) {
        setClientId(parsedData.clientId);
      }

      if (parsedData.understandStatus) {
        setUnderstandStatus(parsedData.understandStatus);
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

  async function changeStatus() {
    console.log(roomId, clientId);
    const res = await fetch(
      `http://localhost:3001/change-understand-status/${roomId}/${clientId}/YES`,
      { method: "POST" }
    );
    const json = await res.json();
    console.log(json);
  }

  return (
    <div>
      <div>Client ID: {clientId}</div>
      <div>Client Name: {name}</div>
      <div>Understand Status: {understandStatus}</div>
      <button onClick={() => changeStatus()}>Change</button>
      {facts.map((fact, i) => (
        <div key={i}>{fact}</div>
      ))}
    </div>
  );
}

export default App;
