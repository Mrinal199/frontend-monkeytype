import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Track SignUp Modal
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const [signupError, setSignupError] = useState("");
  
  const navigate = useNavigate();

  // 🟢 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token } = res.data;

      // ✅ Save Token in Local Storage
      localStorage.setItem("authToken", token);
      console.log("Saved Token:", localStorage.getItem("authToken"));

      // ✅ Redirect to Typing Test UI
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  // 🟢 Handle Sign Up
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    try {
      await axios.post("http://localhost:5000/api/auth/signup", signupData, {
        headers: { "Content-Type": "application/json" },
      });

      // ✅ Close Modal and Reset Data
      setIsModalOpen(false);
      setSignupData({ username: "", email: "", password: "" });
      alert("User registered successfully! Please login.");
    } catch (err) {
      setSignupError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>

      {/* 🟢 Open Sign Up Modal */}
      <button onClick={() => setIsModalOpen(true)} style={styles.signupButton}>Sign Up</button>

      {/* 🟢 Sign Up Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Sign Up</h2>
            {signupError && <p style={styles.error}>{signupError}</p>}
            <form onSubmit={handleSignup} style={styles.form}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Register</button>
            </form>
            <button onClick={() => setIsModalOpen(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// 🟢 Styles
const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column" },
  input: { margin: "10px 0", padding: "8px", fontSize: "16px" },
  button: { padding: "10px", background: "#28a745", color: "#fff", border: "none", cursor: "pointer" },
  error: { color: "red" },
  signupButton: { marginTop: "10px", width:"100%", background: "#007bff", color: "#fff", padding: "8px", border: "none", cursor: "pointer" },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center"
  },
  modal: {
    background: "#fff", padding: "20px", borderRadius: "8px", textAlign: "center", width: "320px"
  },
  closeButton: { marginTop: "10px", background: "#dc3545", color: "#fff", padding: "8px", border: "none", cursor: "pointer" }
};

export default Login;