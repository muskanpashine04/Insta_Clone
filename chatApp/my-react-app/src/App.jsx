import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Chat from "./pages/Chat";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={<PrivateRoute><Users /></PrivateRoute>}
        />
      <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
