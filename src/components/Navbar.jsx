import React, { useContext, useEffect, useState } from "react";
import profilePhoto from "../img/portfolio2.jpg";
import { useNavigate } from "react-router-dom";
import NoteContext from "../NoteContext";

const Navbar = () => {
  const { userDetails } = useContext(NoteContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState("dark"); // default dark

  // Apply theme class to body
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [theme]);

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

      <div>
        <i
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          class="fa-regular fa-moon-stars cursor-pointer"
          style={{ fontSize: "28px" }}
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
