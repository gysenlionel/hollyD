import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Public from "./pages/Public";
import Layout from "./components/Layout";
import RequireAuth from "./features/auth/RequireAuth";
import Protected from "./pages/Protected";
import UsersList from "./pages/UsersList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="protected" element={<Protected />} />
          <Route path="userslist" element={<UsersList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
