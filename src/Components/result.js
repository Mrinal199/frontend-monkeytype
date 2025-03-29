import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wpm, accuracy, errors, correctChars } = location.state || {};

  return (
    <div style={{ textAlign: "center", fontFamily: "monospace", marginTop: "20px" }}>
      <h1>Typing Test Results</h1>
      <p style={{ fontSize: "1.5rem" }}>Speed: {wpm} WPM</p>
      <p style={{ fontSize: "1.5rem" }}>Accuracy: {accuracy}%</p>
      <p style={{ fontSize: "1.2rem", color:"#dc3545"}}>Total Errors: {errors}</p>
      <p style={{ fontSize: "1.2rem", color:"#28a745" }}>Correct Characters Typed: {correctChars}</p>

      <button
        onClick={() => navigate("/")}
        style={{ padding: "10px 20px", fontSize: "1rem", cursor: "pointer", marginTop: "20px" , borderRadius:"8px", background:"#25369d", color:"white"}}
      >
        Try Again
      </button>
    </div>
  );
};

export default Results;