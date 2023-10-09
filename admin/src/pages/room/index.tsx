import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, RoomMessage } from '../../entities/room.entity';

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

function Room() {
  const [facts, setFacts] = useState<string[]>([]);
  const [adminId, setAdminId] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [listening, setListening] = useState(false);
  const [failedStatus, setFailedStatus] = useState(false);

  const roomId = localStorage.getItem('roomId');

  const navigate = useNavigate();

  if (!listening) {
    const events = new EventSource(
      'http://localhost:3001/join-room-admin/' + roomId
    );

    events.onopen = () => {
      console.log('Success join the room');
    };

    events.onmessage = (event) => {
      const parsedData: RoomMessage = JSON.parse(event.data);

      if (parsedData.adminId) {
        setAdminId(parsedData.adminId);
      }

      if (parsedData.clients) {
        console.log(parsedData.clients);
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
    navigate('/');
  }

  const [info, setInfo] = useState<string>('');

  async function onSubmitInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(roomId);
    const res = await fetch(`http://localhost:3001/add-info/${roomId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ info }),
      method: 'POST',
    });
    const json = await res.json();
    setInfo('');
    console.log(json);
  }

  return (
    <>
      {failedStatus ? (
        <section className="flex flex-col gap-[10px] justify-center items-center h-screen w-full">
          <p className="font-bold text-xl">Failed to join the room</p>
          <Button onClick={onBackToHome}>Back to home</Button>
        </section>
      ) : (
        <div className="flex gap-[40px] p-[40px] h-screen">
          <section className="flex flex-col w-full">
            <div className="flex flex-col">
              <span>Admin Id : {adminId}</span>
              <span>Room Id : {localStorage.getItem('roomId')}</span>
            </div>

            <div className="grid grid-cols-4 gap-[16px] mt-[20px] w-full">
              {clients.map((client) => (
                <Card key={client.id}>
                  <CardHeader>
                    <CardTitle>{client.name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription>Need Help!</CardDescription>
                    <CardDescription>
                      Understand Status: {client.understandStatus}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="w-[400px]">
            <Card className="flex flex-col justify-between h-full">
              <div>
                <CardHeader>
                  <CardTitle>Chat Panel</CardTitle>
                  <CardDescription>Info List</CardDescription>
                </CardHeader>

                <CardContent>
                  {facts.map((fact, i) => (
                    <p key={i}>{fact}</p>
                  ))}
                </CardContent>
              </div>

              <form onSubmit={(e) => onSubmitInfo(e)}>
                <CardFooter className="flex flex-col gap-[12px] w-full">
                  <Input
                    type="text"
                    name="info"
                    placeholder="Input message"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                  />

                  <Button type="submit" className="w-full">
                    Send
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </section>
        </div>
      )}
    </>
  );
}

export default Room;
