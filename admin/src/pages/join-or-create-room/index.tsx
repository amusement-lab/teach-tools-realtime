import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "../../entities/room.entity";

function JoinOrCreateRoom() {
  const [roomId, setRoomId] = useState<string>("");

  const navigate = useNavigate();

  async function createRoom() {
    const res = await fetch(`http://localhost:3001/create-room`, {
      method: "POST",
    });
    const roomData: Room = await res.json();
    console.log(roomData.id);
    localStorage.setItem("roomId", roomData.id);
    navigate("/room");
  }

  async function joinRoom() {
    console.log(roomId);
    localStorage.setItem("roomId", roomId);
    navigate("/room");
  }

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <input
        type="text"
        name="roomId"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default JoinOrCreateRoom;
