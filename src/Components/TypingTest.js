import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "./apis";
import "./TypingTest.css";

const TypingTest = ({ token }) => {
  const quotesList = [
    "The only limit to our realization of tomorrow is our doubts of today. We must move forward with strong faith, believing in our ability to create a brighter future filled with possibilities and opportunities for growth, innovation, and progress in every aspect of life.",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. True fulfillment comes from passion, perseverance, and dedication. The road may be challenging, but the rewards of persistence and hard work are always worth it.",
    "Life is what happens when you are busy making other plans. It is full of unexpected twists and turns, requiring us to embrace change, remain adaptable, and find joy in the little moments that make each day unique and meaningful, shaping our journey forward in unexpected ways.",
    "Happiness is not something ready-made. It comes from your own actions. True happiness is found in the effort you put forth, the kindness you extend to others, and the gratitude you hold for the simple yet profound joys that life offers you each and every day.",
    "The only way to do great work is to love what you do. If you haven’t found it yet, keep looking. Don’t settle. Passion fuels excellence, and perseverance leads to mastery. Never stop searching for what sets your soul on fire, for therein lies your greatest purpose in life.",
    "Everything you can imagine is real. The world is shaped by creativity, determination, and belief. If you dare to dream and work toward making that dream a reality, you will find that the impossible is only a temporary state, waiting to be transformed by effort and persistence.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. Strength comes from within, and resilience is built through challenges. No matter what stands in your way, you have the power to overcome, succeed, and inspire others.",
    "Difficulties in life are meant to make us better, not bitter. Every challenge we face teaches us lessons, strengthens our resolve, and shapes us into who we are meant to be. Embrace hardships with courage, for they are the stepping stones to success, wisdom, and personal growth.",
    "Your time is limited, so don’t waste it living someone else’s life. Have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary, and true fulfillment comes from embracing your own unique journey with confidence.",
    "Failure is not the opposite of success; it is part of success. Every setback brings an opportunity to learn, to grow, and to come back stronger. The greatest achievements often arise from the willingness to keep going, despite difficulties, doubts, and temporary defeats along the way.",
  ];

  const getRandomQuote = () => {
    return quotesList[Math.floor(Math.random() * quotesList.length)];
  };

  const [text, setText] = useState(getRandomQuote());
  const [input, setInput] = useState("");
  const [time, setTime] = useState(60);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasStarted && time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [hasStarted, time, isSubmitted]);

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
        setText(getRandomQuote());
        setInput("");
        setErrors(0);
        setCorrectChars(0);
      }, 500);
    }
  };

  const getHighlightedText = () => {
    return text
      .split("")
      .map((char, index) => {
        let color = "gray"; // Default remaining text
        if (index < input.length) {
          color = input[index] === char ? "white" : "red";
        }
        return `<span style="color:${color}">${char}</span>`;
      })
      .join("");
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const elapsedTime = (30 - time) / 60; // Convert seconds to minutes
    const wpm = (correctChars / 5 / elapsedTime).toFixed(2); // WPM calculation
    const accuracy = ((1 - errors / text.length) * 100).toFixed(2);

    // Save session data
    await saveSession(token, {
      wpm,
      accuracy,
      totalErrors: errors,
      correctChars,
    });

    // Navigate to results page
    navigate("/results", { state: { wpm, accuracy, errors, correctChars } });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "./login";
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "monospace",
        marginTop: "20px",
      }}
    >
      <h1>Calculate - Typing - Speed - Accuracy</h1>
      <div
        style={{
          width: "70%",
          margin: "auto",
          textAlign: "left",
          position: "relative",
        }}
      >
        {/* Highlighted text behind textarea */}
        <div
          dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            color: "gray",
            whiteSpace: "pre-wrap",
            pointerEvents: "none", // Prevent clicks
            padding: "10px",
            background: "#1e1e1e",
            border: "1px solid #333",
          }}
          className="typing-area"
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
            color: "transparent",
            border: "1px solid #333",
            position: "relative",
            zIndex: 1,
            resize: "none",
            outline: "none",
            overflow: "hidden",
          }}
        />
      </div>

      <p style={{ fontSize: "1.2rem", marginTop: "28vh" }}>Time left: {time}s</p>
      {/* <button
        onClick={handleSubmit}
        disabled={time > 0}
        style={{ padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}
      >
        Submit
      </button> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap:"1rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            setText(getRandomQuote());
            setInput("");
            setErrors(0);
            setCorrectChars(0);
            setHasStarted(false);
          }}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            color: "white",
            background: "#25369d",
            borderRadius: "80px",
          }}
        >
          {/* <RefreshIcon /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            color="white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0115.02-5.36L23 10"></path>
            <path d="M20.49 15a9 9 0 01-15.02 5.36L1 14"></path>
          </svg>
        </button>
        <br /> <br /> <br />
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            background: "#25369d",
            borderRadius: "8px",
            color: "white",
          }}
        >
          LogOut
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
