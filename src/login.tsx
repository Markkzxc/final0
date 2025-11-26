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

    // Extra validation before sending to Firebase
    if (!email || !password) {
      setMessage("❌ Please enter email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setMessage("✅ Logged in successfully!");
      setSuccess(true);

      navigate("/dashboard");
    } catch (err: any) {
      console.log(err.code);

      // Friendly error messages
      switch (err.code) {
        case "auth/invalid-email":
          setMessage("❌ Invalid email format.");
          break;
        case "auth/wrong-password":
          setMessage("❌ Incorrect password. Please try again.");
          break;
        case "auth/user-not-found":
          setMessage("❌ No account found with this email.");
          break;
        case "auth/invalid-email":
          setMessage("❌ Invalid email format.");
          break;
        case "auth/too-many-requests":
          setMessage("❌ Too many attempts. Please try again later.");
          break;
        default:
          setMessage("❌ Login failed. Please try again.");
          break;
      }
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
          Don't have an account?{" "}
          <span
            className="register-link"
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
