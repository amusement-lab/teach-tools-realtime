import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import JoinOrCreateRoom from './pages/join-or-create-room/index.tsx';
import Room from './pages/room/index.tsx';
import LayoutDefault from './layouts/default.tsx';

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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
