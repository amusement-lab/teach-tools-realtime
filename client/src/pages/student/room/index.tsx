import { useState } from 'react';
import { RoomClientMessage } from '../../../entities/room.entity';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useInterval } from '@/lib/useInterval';

enum UnderstandStatus {
  YES = 'YES',
  NO = 'NO',
  EMPTY = 'EMPTY',
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [facts, setFacts] = useState<string[]>([]);
  const [understandStatus, setUnderstandStatus] = useState<UnderstandStatus>(
    UnderstandStatus.EMPTY
  );

  const [failedStatus, setFailedStatus] = useState(false);
  const [delay, setDelay] = useState<number | null>(1000); //delay can be null for break the interval

  const roomId = localStorage.getItem('roomId');
  const name = localStorage.getItem('name');
  const clientId = localStorage.getItem('clientId');

  useInterval(() => {
    async function fetchData() {
      const res = await fetch(
        `${baseUrl}/listen-client/${roomId}/${clientId}`,
        {
          method: 'GET',
        }
      );
      const parsedData: RoomClientMessage = await res.json();

      console.log(parsedData.message);

      if (parsedData.understandStatus) {
        setUnderstandStatus(parsedData.understandStatus);
      }

      if (parsedData.info) {
        setFacts(parsedData.info);
      }

      if (parsedData.message === 'Room not found') {
        setDelay(null);
        setFailedStatus(true);
      }
    }

    fetchData();
  }, delay);

  async function changeStatus(status: UnderstandStatus) {
    setUnderstandStatus(status);

    const res = await fetch(
      `${baseUrl}/change-understand-status/${roomId}/${clientId}/${status}`,
      { method: 'POST' }
    );
    const json = await res.json();
    console.log(json);
  }

  const navigate = useNavigate();

  function onBackToHome() {
    navigate('/');
  }

  return (
    <>
      {failedStatus ? (
        <section className="flex flex-col gap-[10px] justify-center items-center h-screen relative w-full">
          <p className="font-bold text-xl">Failed to join the room</p>
          <Button onClick={onBackToHome}>Back to home</Button>
        </section>
      ) : (
        <section
          className={
            understandStatus === 'YES'
              ? 'bg-red-400 flex gap-[40px] h-screen'
              : understandStatus === 'NO'
              ? 'bg-green-400 flex gap-[40px] h-screen'
              : 'flex gap-[40px] h-screen'
          }
        >
          <div className="flex flex-col w-full p-[40px] pr-[400px]">
            <div className="flex flex-col">
              <span>Room Id : {localStorage.getItem('roomId')}</span>
              <div>Client ID: {clientId}</div>
              <div>Client Name: {name}</div>
              <div>Understand Status: {understandStatus}</div>
            </div>

            <div className="flex flex-col justify-center items-center h-[400px] w-full">
              <h1 className="font-bold text-[32px]">Are You Need Help?</h1>

              <div className="flex flex-row gap-[16px] mt-[10px]">
                <Button
                  className="bg-red-500"
                  onClick={() => changeStatus(UnderstandStatus.YES)}
                  disabled={understandStatus === 'YES'}
                >
                  Yes, I Need!
                </Button>

                <Button
                  className="bg-green-500"
                  onClick={() => changeStatus(UnderstandStatus.NO)}
                  disabled={understandStatus === 'NO'}
                >
                  No, Im Good
                </Button>
              </div>
            </div>
          </div>

          <div className="fixed h-full right-0 p-[40px] w-[400px]">
            <Card className="flex flex-col justify-between h-full">
              <div>
                <CardHeader>
                  <CardTitle>Chat Panel</CardTitle>
                  <CardDescription>Info List</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-[16px] overflow-y-auto pb-[30px] h-[100vh] md:h-[70vh]">
                  {facts.map((fact, i) => (
                    <p
                      className="break-words bg-slate-100 px-[22px] py-[10px] rounded-[6px]"
                      key={i}
                    >
                      {fact}
                    </p>
                  ))}
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}
    </>
  );
}

export default App;
