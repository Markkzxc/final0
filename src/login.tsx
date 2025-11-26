import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);

      setMessage("✅ Logged in successfully!");
      setSuccess(true);

      // Navigate to dashboard after login
      navigate("/dashboard");
    } catch (err: any) {
      setMessage("❌ Error: " + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Welcome Back!</h2>
        <p className="login-intro">
          Log in to manage your tasks and stay organized with your personal To-Do App.
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && (
          <div className={`login-message ${success ? "success" : ""}`}>
            {message}
          </div>
        )}
        <p className="login-footer">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
