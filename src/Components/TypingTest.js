import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { saveSession } from "./apis";

const TypingTest = ({ token }) => {
  const wordsList = [
    "public", "end", "present", "make", "move", "people", "state",
    "against", "begin", "few", "face", "turn", "just", "little",
    "again", "course"
  ];

  const getRandomWords = () => {
    return Array.from({ length: 8 }, () => wordsList[Math.floor(Math.random() * wordsList.length)]).join(" ");
  };

  const [text, setText] = useState(getRandomWords());
  const [input, setInput] = useState("");
  const [time, setTime] = useState(30);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasStarted && time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, time]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!hasStarted) setHasStarted(true); // Start timer on first keystroke
    if (value.length > text.length) return; // Prevent extra typing beyond given text

    setInput(value);

    let errorCount = 0;
    let correctCount = 0;

    value.split("").forEach((char, index) => {
      if (char === text[index]) {
        correctCount++;
      } else {
        errorCount++;
      }
    });

    setErrors(errorCount);
    setCorrectChars(correctCount);

    // Change words if the user completes typing the current set
    if (value.length === text.length) {
      setTimeout(() => {
        setText(getRandomWords());
        setInput("");
        setErrors(0);
        setCorrectChars(0);
      }, 500);
    }
  };

  const getHighlightedText = () => {
    return text.split("").map((char, index) => {
      let color = "gray"; // Default remaining text
      if (index < input.length) {
        color = input[index] === char ? "blue" : "red";
      }
      return `<span style="color:${color}">${char}</span>`;
    }).join("");
  };

  const handleSubmit = async () => {
    const elapsedTime = (30 - time) / 60; // Convert seconds to minutes
    const wpm = ((correctChars / 5) / elapsedTime).toFixed(2); // WPM calculation
    const accuracy = ((1 - errors / text.length) * 100).toFixed(2);

    // Save session data
    await saveSession(token, { wpm, accuracy, totalErrors: errors, correctChars });

    // Navigate to results page
    navigate("/results", { state: { wpm, accuracy, errors, correctChars } });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "./login"
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "monospace", marginTop: "20px" }}>
      <h1>Monkey-Type</h1>
      <div style={{ width: "50%", margin: "auto", textAlign: "left", position: "relative" }}>
        
        {/* Highlighted text behind textarea */}
        <div
          dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            fontSize: "1.2rem",
            color: "gray",
            whiteSpace: "pre-wrap",
            pointerEvents: "none", // Prevent clicks
            padding: "10px",
            background: "#1e1e1e",
            border: "1px solid #333"
          }}
        ></div>

        {/* Transparent textarea to capture user input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          disabled={time === 0}
          autoFocus
          style={{
            height: "10rem",
            width: "100%",
            fontSize: "1.2rem",
            marginTop: "10px",
            paddingLeft: "10px",
            background: "transparent",
            color: "transparent", // Hide text
            caretColor: "white", // Keep caret visible
            border: "1px solid #333",
            position: "relative",
            zIndex: 1,
            resize: "none",
            outline: "none",
            overflow: "hidden",
          }}
        />
      </div>

      <p style={{ fontSize: "1.2rem", marginTop: "5%" }}>Time left: {time}s</p>

      <button
        onClick={handleSubmit}
        disabled={time > 0}
        style={{ padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}
      >
        Submit
      </button>
      <br/> <br/> <br/>
      <button
        onClick={handleLogout}
        style={{ padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}
      >
        LogOut
      </button>
    </div>
  );
};

export default TypingTest;