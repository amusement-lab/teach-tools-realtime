import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Client, RoomMessage } from "@/entities/room.entity";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInterval } from "@/lib/useInterval";

function Room() {
  const [facts, setFacts] = useState<string[]>([]);
  // const [adminId, setAdminId] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [failedStatus, setFailedStatus] = useState(false);
  const [delay, setDelay] = useState<number | null>(1000); //delay can be null for break the interval
  const [listening, setListening] = useState(false);

  const roomId = localStorage.getItem("roomId");
  const adminId = localStorage.getItem("adminId");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!listening) {
      const events = new EventSource(
        `${baseUrl}/listen-admin/${roomId}/${adminId}`
      );

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        console.log(parsedData);

        if (parsedData.clients) {
          setClients(parsedData.clients);
        }

        if (parsedData.info) {
          setFacts(parsedData.info);
        }

        setListening(true);
        console.log(listening);
      };

      events.onerror = (event) => {
        events.close();
        console.log(event);
        setFailedStatus(true);
        setListening(true);
      };
    }
  }, [listening, facts, baseUrl, roomId, adminId]);

  const [info, setInfo] = useState<string>("");

  async function onSubmitInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(roomId);
    const res = await fetch(`${baseUrl}/add-info/${roomId}`, {
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

  async function onResetStatus() {
    console.log("Reset Clicked");
    const res = await fetch(`${baseUrl}/reset-understand-status/${roomId}`, {
      method: "POST",
    });
    const json = await res.json();
    console.log(json);
  }

  const navigate = useNavigate();

  function onBackToHome() {
    navigate("/admin");
  }

  return (
    <>
      {failedStatus ? (
        <section className="flex flex-col gap-[10px] justify-center items-center h-screen relative w-full">
          <p className="font-bold text-xl">Failed to join the room</p>
          <Button onClick={onBackToHome}>Back to home</Button>
        </section>
      ) : (
        <section className="flex gap-[40px] h-screen">
          <div className="flex flex-col w-full px-[40px] py-[40px] pr-[400px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold">Admin Id : {adminId}</span>
                <span className="font-bold">
                  Room Id : {localStorage.getItem("roomId")}
                </span>
              </div>

              <Button
                className="bg-yellow-500 hover:bg-yellow-400"
                onClick={onResetStatus}
              >
                Reset Status
              </Button>
            </div>

            <div className="gap-[16px] grid grid-cols-4 mt-[20px] pb-[40px] w-full">
              {clients.map((client) => (
                <Card
                  key={client.id}
                  className={
                    client.understandStatus === "YES"
                      ? "bg-red-200"
                      : client.understandStatus === "NO"
                      ? "bg-green-200"
                      : ""
                  }
                >
                  <CardHeader>
                    <CardTitle>{client.name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {client.understandStatus === "YES" ? (
                      <p className="text-md font-medium">Need Help!</p>
                    ) : client.understandStatus === "NO" ? (
                      <p className="text-md font-medium">All Good!</p>
                    ) : (
                      <p className="text-md font-medium">-</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="fixed h-full right-0 p-[40px] w-[400px]">
            <Card className="flex flex-col justify-between h-full">
              <div>
                <CardHeader>
                  <CardTitle>Chat Panel</CardTitle>
                  <CardDescription>Info List</CardDescription>
                </CardHeader>

                <CardContent
                  id="chatbox"
                  className="flex flex-col gap-[16px] overflow-y-auto pb-[30px] h-[100vh] md:h-[60vh]"
                >
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
          </div>
        </section>
      )}
    </>
  );
}

export default Room;
