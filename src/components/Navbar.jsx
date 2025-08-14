import React from "react";
import profilePhoto from "../img/portfolio2.jpg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="mx-4 mt-4 flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0">
      {/* Left: avatar + name */}
      <div className="flex items-center gap-3">
        <img
          src={profilePhoto}
          alt="Tarique Ansari"
          loading="lazy"
          decoding="async"
          className="w-16 h-16 rounded-full border object-cover"
        />
        <h5 className="text-lg font-medium">Tarique Ansari</h5>
      </div>

      {/* Center: title */}
      <h1 className="text-2xl font-bold text-center">Notes App</h1>

      {/* Right: small subtitle */}
      {/* <div className="text-sm text-gray-600">Created by Tarique Ansari</div> */}
      <div
        onClick={() => {
          navigate("/signup");
        }}
      >
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Signup
        </button>
      </div>
    </header>
  );
};

export default Navbar;
