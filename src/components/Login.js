import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }
    setError("");
    setIsLoading(true);
    onLogin(); // Trigger the login in App.js
    setTimeout(() => {
      setIsLoading(false); // Reset loading after login
    }, 2000); // Simulate a login process
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={styles.togglePasswordButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          <button
            type="submit"
            style={styles.submitButton}
            disabled={isLoading}


            
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: "flex",             // Flexbox to align children
    justifyContent: "center",   // Center horizontally
    alignItems: "center",       // Center vertically
    height: "100vh",            // Full viewport height
    margin: 0,                  // Ensure no default margin
    padding: 0,                 // Remove any default padding
    backgroundColor: "#2f2f2f", // Background color
    width: "100%",              // Ensure the container takes up full width
  },
  loginBox: {
    backgroundColor: "#3c3c3c",  // Dark background for the form
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Subtle shadow for the form
    width: "100%",
    maxWidth: "400px",           // Maximum width of the form
    textAlign: "center",         // Center text inside the form
  },
  heading: {
    color: "#fff",
    fontSize: "24px",
    marginBottom: "20px",        // Space below the heading
  },
  label: {
    display: "block",
    fontSize: "16px",
    color: "#e0e0e0",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #555",
    backgroundColor: "#444",
    color: "#e0e0e0",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  submitButton: {
    padding: "10px",
    width: "100%",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50", // Green for submit button
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  togglePasswordButton: {
    padding: "5px 10px",
    backgroundColor: "#666",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};

export default Login;
