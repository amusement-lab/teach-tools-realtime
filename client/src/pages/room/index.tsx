import { useState } from "react";
import { RoomClientMessage } from "../../entities/room.entity";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  async function changeStatus(status: UnderstandStatus) {
    setUnderstandStatus(status);

    const res = await fetch(
      `http://localhost:3001/change-understand-status/${roomId}/${clientId}/${status}`,
      { method: "POST" }
    );
    const json = await res.json();
    console.log(json);
  }

  return (
    <section className="flex gap-[40px] p-[40px] h-screen">
      <div className="flex flex-col w-full">
        <div className="flex flex-col">
          <span>Room Id : {localStorage.getItem("roomId")}</span>
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
            >
              Yes, I Need!
            </Button>

            <Button
              className="bg-green-500"
              onClick={() => changeStatus(UnderstandStatus.NO)}
            >
              No, Im Good
            </Button>
          </div>
        </div>
      </div>

      <div className="w-[400px]">
        <Card className="flex flex-col justify-between h-full">
          <div>
            <CardHeader>
              <CardTitle>Chat Panel</CardTitle>
              <CardDescription>Info List</CardDescription>
            </CardHeader>

            <CardContent>
              {facts.map((fact, i) => (
                <div key={i}>{fact}</div>
              ))}
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default App;
