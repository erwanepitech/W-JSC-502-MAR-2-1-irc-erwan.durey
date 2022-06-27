import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Login from "./components/Login";
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:4001";
const socket = io(ENDPOINT);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" exact element={<Login />} />
      <Route path="/chat" element={<Chat socket={socket} />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
