import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StoryChat from "../components/StoryChat"; // ✅ Import new chat component
import { useAuth } from "../contexts/AuthContext";

const ChatPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) navigate("/"); // Redirect to login if not authenticated
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">📖 Story Chat</h2>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <StoryChat />
        </div>
    );
};

export default ChatPage;
