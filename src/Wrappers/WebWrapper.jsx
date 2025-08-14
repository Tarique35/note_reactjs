import React from "react";
import { Outlet } from "react-router-dom";
import NoteContext from "../NoteContext";
import AppProperties from "../AppProperties";

const WebWrapper = () => {
  const loca = AppProperties.loca;
  const tokenName = AppProperties.tokenName;

  return (
    <>
      <NoteContext.Provider value={{ loca, tokenName }}>
        <Outlet />
      </NoteContext.Provider>
    </>
  );
};

export default WebWrapper;
