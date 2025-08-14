import React, { Children } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WebWrapper from "../Wrappers/WebWrapper";
import HomePage from "./HomePage";
import SignUp from "./SignUp";
import Login from "./Login";
import NotePage from "./NotePage";

const MainComponent = () => {
  const routers = createBrowserRouter([
    {
      element: <WebWrapper />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/note",
          element: <NotePage />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
};

export default MainComponent;
