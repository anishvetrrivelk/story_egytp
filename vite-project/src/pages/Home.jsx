import { useState } from "react";
import ChatBot from "../components/ChatBot";

// Placeholder ImagePanel component
function ImagePanel() {
    return (
        <div className="h-full bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-gray-200 w-full max-w-md h-64 rounded-lg flex items-center justify-center mb-4">
                <div className="text-gray-500 text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm">Image will be generated here</p>
                </div>
            </div>
            <p className="text-gray-600 text-center">
                Story illustration coming soon...
            </p>
        </div>
    );
}

export default function Home() {
    const [story, setStory] = useState(null);

    return (
        <div className="flex h-screen w-full">
            <div className="w-full border-r bg-gray-100">

                <ChatBot onStoryGenerated={setStory} />
            </div>


        </div>
    );
}