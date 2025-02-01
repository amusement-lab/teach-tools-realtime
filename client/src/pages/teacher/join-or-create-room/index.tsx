import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomCreatedResponse } from "../../../entities/room.entity";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function JoinOrCreateRoom() {
  const [roomId, setRoomId] = useState<string>("");
  const [adminId, setAdminId] = useState<string>("");

  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  async function createRoom() {
    const res = await fetch(`${baseUrl}/create-room`, {
      method: "POST",
    });
    const room: RoomCreatedResponse = await res.json();
    localStorage.setItem("roomId", room.roomId);
    localStorage.setItem("adminId", room.adminId);
    navigate("/admin/room");
  }

  async function joinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("adminId", adminId);
    navigate("/admin/room");
  }

  return (
    <section className="flex flex-col justify-center items-center h-screen w-full">
      <Tabs defaultValue="create-room" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="create-room">Create Room</TabsTrigger>
          <TabsTrigger value="join-room">Join Room</TabsTrigger>
        </TabsList>

        <TabsContent value="create-room">
          <Card>
            <CardHeader>
              <CardTitle>Create Room</CardTitle>
              <CardDescription>
                Create virtual teach space for class
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button onClick={createRoom}>Create Room</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="join-room">
          <Card>
            <CardHeader>
              <CardTitle>Join Room</CardTitle>
              <CardDescription>
                Join already created virtual teach space
              </CardDescription>
            </CardHeader>

            <form onSubmit={(e) => joinRoom(e)} className="space-y-1">
              <CardContent>
                <div className="space-y-1">
                  <Input
                    type="text"
                    name="roomId"
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                </div>
                <div className="space-y-1 mt-3">
                  <Input
                    type="text"
                    name="adminId"
                    placeholder="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit">Join Room</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default JoinOrCreateRoom;
