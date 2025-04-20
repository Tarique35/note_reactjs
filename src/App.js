import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import NotePage from "./components/NotePage";
import MainComponent from "./components/MainComponent";
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <>
      <MainComponent />
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/note" element={<NotePage />} />
        </Routes>
      </BrowserRouter> */}
    </>
  );
}

export default App;
