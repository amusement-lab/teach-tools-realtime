import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomMessage } from "../../entities/room.entity";

function Room() {
  const [facts, setFacts] = useState<string[]>([]);
  const [adminId, setAdminId] = useState<string>("");
  const [clients, setClients] = useState<{ id: string }[]>([]);
  const [listening, setListening] = useState(false);
  const [failedStatus, setFailedStatus] = useState(false);

  const roomId = localStorage.getItem("roomId");

  const navigate = useNavigate();

  if (!listening) {
    const events = new EventSource(
      "http://localhost:3001/join-room-admin/" + roomId
    );

    events.onopen = () => {
      console.log("Success join the room");
    };

    events.onmessage = (event) => {
      const parsedData: RoomMessage = JSON.parse(event.data);

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

    events.onerror = () => {
      events.close();
      setFailedStatus(true);
    };

    setListening(true);
  }

  async function onBackToHome() {
    navigate("/");
  }

  const [info, setInfo] = useState<string>("");

  async function onSubmitInfo() {
    console.log(roomId);
    const res = await fetch(`http://localhost:3001/add-info/${roomId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ info }),
      method: "POST",
    });
    const json = await res.json();
    setInfo("");
    console.log(json);
  }

  return (
    <>
      {failedStatus ? (
        <div>
          <p>Failed to join the room</p>
          <button onClick={onBackToHome}>Back to home</button>
        </div>
      ) : (
        <div>
          <div>Admin Id : {adminId}</div>
          <div>Room Id : {localStorage.getItem("roomId")}</div>

          <input
            type="text"
            name="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />

          <button onClick={onSubmitInfo}>Submit info</button>

          <p>Info List</p>
          {facts.map((fact, i) => (
            <div key={i}>{fact}</div>
          ))}

          <p>Clients List</p>
          {clients.map((client, i) => (
            <div key={i}>{client.id}</div>
          ))}
        </div>
      )}
    </>
  );
}

export default Room;
