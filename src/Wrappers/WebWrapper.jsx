import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NoteContext from "../NoteContext";
import AppProperties from "../AppProperties";
import axios from "axios";
import { getTheme } from "../../functions";

const WebWrapper = () => {
  const loca = AppProperties.loca;
  const tokenName = AppProperties.tokenName;

  const [theme, setTheme] = useState(getTheme());
  const [userDetails, setUserDetails] = useState();
  const [chatVisible, setChatVisible] = useState(false);

  const getUserDetail = async () => {
    await axios
      .get(`${loca}/currentuser`, {
        headers: {
          Authorization: `Bearer ${noteToken}`,
        },
      })
      .then((resp) => {
        console.log("user data:", resp.data);
        setUserDetails(resp.data);
      });
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const noteToken = localStorage.getItem(tokenName);

  return (
    <>
      <NoteContext.Provider
        value={{
          loca,
          tokenName,
          noteToken,
          userDetails,
          theme,
          setTheme,
          chatVisible,
          setChatVisible,
        }}
      >
        <Outlet />
      </NoteContext.Provider>
    </>
  );
};

export default WebWrapper;
