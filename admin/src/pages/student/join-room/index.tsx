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

function JoinOrCreateRoom() {
  const [roomId, setRoomId] = useState<string>('');
  const [name, setName] = useState<string>('');

  const navigate = useNavigate();

  async function joinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem('roomId', roomId);
    localStorage.setItem('name', name);
    navigate('/student/room');
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
