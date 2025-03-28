import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TypingTest from "./Components/TypingTest";
import Results from "./Components/result";
import Login from "./Components/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute component={TypingTest} />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem("authToken");
  return token ? <Component /> : (window.location.href = "/login");
};

export default App;