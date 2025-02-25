import React, { useState } from "react";
import "../style/SignUp.css";
import axios from "axios";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fieldsVerify = () => {
    setError(""); // Clear previous errors

    // Check for empty fields
    if (!name || !email || !password) {
      let missingFields = [];
      if (!name) missingFields.push("Name");
      if (!email) missingFields.push("Email");
      if (!password) missingFields.push("Password");

      setError(
        `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } required!`
      );
      return false; // Return false if validation fails
    }

    // Check for valid email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
      return false; // Return false if validation fails
    }

    // Check for password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return false; // Return false if validation fails
    }

    return true; // Return true if all validations pass
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Call fieldsVerify and store the result
    const isValid = fieldsVerify();
    console.log("fields are: ", name, email, password);

    // If validation fails, stop further execution
    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post(
        // "http://localhost:8080/api/auth/signup",
        "http://localhost:8090/register",
        {
          // name,
          // email,
          // password,
          username: name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Sign up successful");
      console.log(response.data); // Log the response directly
    } catch (error) {
      console.log(error);
      setError("An error occurred during signup. Please try again."); // Set an error message for user feedback
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
          <h1 className="text-center">Signup Page</h1>
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
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
