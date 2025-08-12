// src/pages/Signup.jsx
import { Link } from "react-router-dom";

const Signup = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-md w-full max-w-sm border border-gray-300">
                <h1 className="text-2xl font-medium mb-4 text-center text-gray-800">Signup</h1>
                <form className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <button
                        type="submit"
                        className="bg-gray-800 text-white py-2 rounded hover:bg-gray-700 text-sm"
                    >
                        Signup
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="text-gray-700 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
