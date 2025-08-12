import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // 🔁 Not logged in: Redirect to login page ("/")
        return <Navigate to="/" replace />;
    }

    // ✅ Logged in: Show the protected component
    return children;
};

export default ProtectedRoute;
