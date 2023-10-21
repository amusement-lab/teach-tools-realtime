import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { JoinClientRoom } from '@/entities/room.entity';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function JoinOrCreateRoom() {
  const [roomId, setRoomId] = useState<string>('');
  const [name, setName] = useState<string>('');

  const navigate = useNavigate();

  async function joinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(`${baseUrl}/join-client-room/${roomId}/${name}`, {
      method: 'GET',
    });
    console.log(res);
    const room: JoinClientRoom = await res.json();

    if (room) {
      localStorage.setItem('roomId', roomId);
      localStorage.setItem('name', name);
      localStorage.setItem('clientId', room.id); //this is mean clientID, need refactor;
      navigate('/room');
    }
  }

  return (
    <section className="flex flex-col justify-center items-center h-screen w-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Join Room</CardTitle>
          <CardDescription>Join to virtual teach space</CardDescription>
        </CardHeader>

        <form onSubmit={(e) => joinRoom(e)}>
          <CardContent className="flex flex-col gap-[12px]">
            <Input
              type="text"
              name="roomId"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit">Join Room</Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}

export default JoinOrCreateRoom;
