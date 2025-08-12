import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../index.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Login failed");

            const data = await res.json();
            setUser(data); // ✅ Store in auth context
            localStorage.setItem("user", JSON.stringify(data)); // ✅ Persist on reload
            navigate("/chat"); // ✅ Navigate to protected page
        } catch (err) {
            console.error("Login error:", err.message);
            alert("Login failed. Check credentials or server.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Welcome Back</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <p className="login-footer">
                    Don’t have an account?{" "}
                    <a href="/signup" className="login-link">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
