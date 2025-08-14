import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NoteContext from "../NoteContext";

const SignUp = () => {
  const { loca } = useContext(NoteContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const fieldsVerify = () => {
    setError(""); // Clear previous errors

    // Check for empty fields
    if (!name.trim() || !email.trim() || !password) {
      const missingFields = [];
      if (!name.trim()) missingFields.push("Name");
      if (!email.trim()) missingFields.push("Email");
      if (!password) missingFields.push("Password");

      setError(
        `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } required!`
      );
      return false;
    }

    // Check for valid email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
      return false;
    }

    // Check for password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!fieldsVerify()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${loca}/auth/signup/user`,
        {
          name: name,
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Handle response shape depending on your backend
      setMessage("Sign up successful. You can now log in.");
      console.log("signup response:", response.data);

      // Optional: redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (err) {
      console.error(err);
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "An error occurred during signup. Please try again.";
      setError(
        typeof serverMessage === "string"
          ? serverMessage
          : JSON.stringify(serverMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Signup</h1>

        {message && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 p-2 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 underline"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
