import React, { useContext, useEffect, useState } from "react";
import profilePhoto from "../img/portfolio2.jpg";
import { useNavigate } from "react-router-dom";
import NoteContext from "../NoteContext";
import { applyTheme, getTheme, toggleTheme } from "../../functions";

const Navbar = () => {
  const { userDetails, theme, setTheme, chatVisible, setChatVisible } =
    useContext(NoteContext);
  const navigate = useNavigate();

  useEffect(() => {
    applyTheme(theme); // apply on mount
  }, [theme]);

  const currentTheme = getTheme();

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next); // just updates UI label, not driving theme
  };

  return (
    <header className="mx-4 pt-4 flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0">
      {/* Left: avatar + name */}
      <div className="flex items-center gap-3">
        <img
          src={profilePhoto}
          alt="Tarique Ansari"
          loading="lazy"
          decoding="async"
          className="w-16 h-16 rounded-full border object-cover"
        />
        <h5 className="text-lg font-medium">{userDetails?.name}</h5>
      </div>

      {/* Center: title */}
      <h1 className="text-2xl font-bold text-center">Notes App</h1>

      {/* Right: small subtitle */}
      {/* <div className="text-sm text-gray-600">Created by Tarique Ansari</div> */}

      <div className="flex flex-row items-center">
        <i
          class="fa-light fa-microchip-ai text-[26px] me-3 cursor-pointer"
          onClick={() => setChatVisible(!chatVisible)}
        ></i>
        <i
          onClick={() => handleToggle()}
          className={`cursor-pointer ${
            currentTheme === "light"
              ? "fa-regular fa-moon-stars "
              : "fa-light fa-sun-bright"
          }`}
          style={{ fontSize: "26px" }}
        ></i>
        <button
          onClick={() => {
            navigate("/signup");
          }}
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          className="ms-4 py-2 px-4 rounded secondry text-[16px] text-gray-50 cursor-pointer"
        >
          Signup
        </button>
      </div>
    </header>
  );
};

export default Navbar;
