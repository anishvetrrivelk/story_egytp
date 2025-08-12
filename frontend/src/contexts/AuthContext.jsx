import { createContext, useContext, useEffect, useState } from "react";

// ✅ Create the context
export const AuthContext = createContext();

// ✅ Create the provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user info
    const [loading, setLoading] = useState(true); // Loading while checking localStorage

    // ✅ Load user from localStorage on first render
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Create a hook for easy usage
export const useAuth = () => useContext(AuthContext);
