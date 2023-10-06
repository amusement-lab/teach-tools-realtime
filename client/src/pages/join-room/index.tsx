import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinOrCreateRoom() {
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const navigate = useNavigate();

  async function joinRoom() {
    console.log(roomId);
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("name", name);
    navigate("/room");
  }

  return (
    <div>
      <input
        type="text"
        name="roomId"
        placeholder="room id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        name="name"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default JoinOrCreateRoom;
