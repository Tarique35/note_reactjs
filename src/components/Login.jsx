import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8090/login",
        {
          username: name,
          email: email,
          password: password,
        },
        {
          header: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Sign up successful");
      console.log(response.data);
    } catch (error) {
      setError(error);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          //   alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div className="mt-5">
          <h1 className="text-center">Login Page</h1>
          <div className="center-flex mt-3" style={{ width: "420px" }}>
            <p>{error}</p>
            <form onSubmit={handleSubmit}>
              <div className="col-flex">
                <input
                  className="signup-input"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <input
                  className="signup-input"
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <input
                  className="signup-input"
                  type="text"
                  placeholder="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
