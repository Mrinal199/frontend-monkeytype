import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../Components/apis"; // Import API functions

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(false);

    try {
      const res = await login({ email, password }); 
      const { token } = res.data;

      localStorage.setItem("authToken", token);
      console.log("Saved Token:", localStorage.getItem("authToken"));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setIsLoading(true);

    try {
      await signup(signupData); // Use signup function

      setIsModalOpen(false);
      setSignupData({ username: "", email: "", password: "" });
      alert("User registered successfully! Please login.");
    } catch (err) {
      setSignupError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div style={styles.container}>
      <h3>Get ready for the typing test!</h3>
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
        <button type="submit" style={styles.button} disabled={isLoading}>{isLoading ? "Please wait..." : "Login"}</button>
      </form>

      <button onClick={() => setIsModalOpen(true)} style={styles.signupButton}>Sign Up</button>

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
              <button type="submit" style={styles.button} disabled={isLoading}>{isLoading ? "Please wait..." : "Register"}</button>
            </form>
            <button onClick={() => setIsModalOpen(false)}  style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

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
  button: { padding: "10px", background: "#28a745", color: "#fff", border: "none", cursor: "pointer", borderRadius:"8px", width:"50%" },
  error: { color: "red" },
  signupButton: { marginTop: "10px", width:"50%", background: "#007bff", color: "#fff", padding: "8px", border: "none", cursor: "pointer", borderRadius:"8px"  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center"
  },
  modal: {
    background: "#fff", padding: "20px", borderRadius: "8px", textAlign: "center", width: "320px"
  },
  closeButton: { marginTop: "10px", background: "#dc3545", color: "#fff", padding: "8px", border: "none", cursor: "pointer" , borderRadius:"8px", width:"50%", }
};

export default Login;