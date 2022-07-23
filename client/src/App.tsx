import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Public from "./pages/Public";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
