import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import JoinOrCreateRoom from "./pages/join-or-create-room/index.tsx";
import Room from "./pages/room/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <JoinOrCreateRoom />,
  },
  {
    path: "/room",
    element: <Room />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
