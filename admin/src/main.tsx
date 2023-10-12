import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import LayoutDefault from './layouts/default.tsx';
import LayoutStudent from './layouts/student.tsx';

import JoinOrCreateRoom from './pages/teacher/join-or-create-room/index.tsx';
import Room from './pages/teacher/room/index.tsx';

import StudentJoinRoom from './pages/student/join-room';
import StudentRoom from './pages/student/room/index.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <JoinOrCreateRoom />,
      },
      {
        path: '/room',
        element: <Room />,
      },
    ],
  },
  {
    path: '/student',
    element: <LayoutStudent />,
    children: [
      {
        index: true,
        element: <StudentJoinRoom />,
      },
      {
        path: '/student/room',
        element: <StudentRoom />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
