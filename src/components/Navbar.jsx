import React from "react";
import profilePhoto from "../img/portfolio2.jpg";

const Navbar = () => {
  return (
    <>
      <div
        className="d-flex mx-2 mt-2"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="d-flex align-items-center">
          <img
            className="border"
            src={profilePhoto}
            alt=""
            style={{
              width: "70px",
              borderRadius: "50%",
            //   border: "1px solid black",
            }}
          />
          <h5 className="ms-1">Tarique Ansari</h5>
        </div>
        <h1>Notes App</h1>
        <h6>Created By Tarique Ansari</h6>
      </div>
    </>
  );
};

export default Navbar;
