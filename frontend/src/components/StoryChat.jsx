import axios from "axios";
import { useState } from "react";

const StoryChat = ({ token, userId }) => {
    const [userInput, setUserInput] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [story, setStory] = useState("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isStoryGenerated, setIsStoryGenerated] = useState(false);
    const [currentStoryId, setCurrentStoryId] = useState(null); // Track the story_id returned from backend

    const constantQuestions = [
        "What is your story idea?",
        "Who are the main characters?",
        "What genre is the story?",
        "What should be the ending like?",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentQuestion = constantQuestions[questionIndex];
        const updatedChatLog = [...chatLog, { question: currentQuestion, answer: userInput }];
        setChatLog(updatedChatLog);
        setUserInput("");

        try {
            const payload = {
                [`question${questionIndex + 1}`]: currentQuestion,
                [`answer${questionIndex + 1}`]: userInput,
                user_id: userId,
                story_idea: questionIndex === 0 ? userInput : updatedChatLog[0].answer,
            };

            console.log("🟡 Sending answer:", payload);

            const res = await axios.post("http://localhost:5000/story/add-story", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("🟢 Saved to DB:", res.data);

            if (res.data.story_id && !currentStoryId) {
                setCurrentStoryId(res.data.story_id); // Store the story ID for generating story later
            }

            if (questionIndex < constantQuestions.length - 1) {
                setQuestionIndex((prev) => prev + 1);
            } else {
                console.log("📤 All questions answered. Generating story for story_id:", res.data.story_id);

                const response = await axios.get(
                    `http://localhost:5000/story/generate-story/${res.data.story_id}`
                );

                console.log("✅ Story generated:", response.data.generated_story);

                setStory(response.data.generated_story);
                setIsStoryGenerated(true);
            }
        } catch (error) {
            console.error("❌ Error submitting or generating story:", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">📜 Story Chat</h1>

            {!isStoryGenerated ? (
                <>
                    <p className="mb-2 font-medium">{constantQuestions[questionIndex]}</p>
                    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-1 p-2 border rounded"
                            required
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            Submit
                        </button>
                    </form>

                    <div className="space-y-2">
                        {chatLog.map((entry, index) => (
                            <div key={index} className="bg-gray-100 p-2 rounded">
                                <strong>Q:</strong> {entry.question}
                                <br />
                                <strong>A:</strong> {entry.answer}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-2">🎉 Your story is ready!</h2>
                    <p className="whitespace-pre-line bg-yellow-100 p-4 rounded">{story}</p>
                </div>
            )}
        </div>
    );
};

export default StoryChat;
