import { useState } from "react";
import ChatBot from "../components/ChatBot";
import StoryPanel from "../components/StoryPanel";

export default function Home() {
    const [story, setStory] = useState(null);

    return (
        <div className="flex h-screen w-full">
            <div className="w-2/5 border-r bg-gray-100">
                <ChatBot onStoryGenerated={setStory} />
            </div>
            <div className="w-3/5">
                {story ? (
                    <StoryPanel story={story} />
                ) : (
                    <div className="p-6 text-gray-400">Story will appear here...</div>
                )}
            </div>
        </div>
    );
}