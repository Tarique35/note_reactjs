import React from "react";
import { Outlet } from "react-router-dom";
import NoteContext from "../NoteContext";
import AppProperties from "../AppProperties";

const WebWrapper = () => {
  const loca = AppProperties.loca;
  return (
    <>
      <NoteContext.Provider value={{ loca: loca }}>
        <Outlet />
      </NoteContext.Provider>
    </>
  );
};

export default WebWrapper;
