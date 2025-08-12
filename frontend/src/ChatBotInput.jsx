import axios from "axios";
import { useState } from "react";

const ChatBotInput = () => {
    const [storyIdea, setStoryIdea] = useState("");
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const [story, setStory] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                user_id: 1, // You can make this dynamic later
                ans1: answers[0],
                ans2: answers[1],
                ans3: answers[2],
                ans4: answers[3],
                story_idea: storyIdea,
            };

            const response = await axios.post("http://localhost:5000/submit-answers", payload);

            // Simulated LLM response — this will be replaced with actual LLM call later
            const fakeStory = Array.from({ length: 10 }, (_, i) => ({
                paragraph: `Paragraph ${i + 1}: This is a placeholder story segment based on your input.`,
                image: "https://via.placeholder.com/300x200?text=Image+" + (i + 1),
            }));

            setStory(fakeStory);
        } catch (error) {
            console.error("Submission failed", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen p-6 bg-[#f5f1e5] font-serif">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4">
                <h1 className="text-2xl font-bold text-center text-[#5c3a21]">🪔 AI StoryWeaver: Egyptian Tale Generator</h1>

                <div className="space-y-2">
                    <label className="font-semibold text-[#5c3a21]">What is your story idea?</label>
                    <input
                        type="text"
                        value={storyIdea}
                        onChange={(e) => setStoryIdea(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-700"
                    />
                </div>

                {["What is the main character like?", "What is the setting?", "What challenge do they face?", "How should the story end?"].map((question, idx) => (
                    <div key={idx} className="space-y-1">
                        <label className="text-[#5c3a21] font-medium">{question}</label>
                        <input
                            type="text"
                            value={answers[idx]}
                            onChange={(e) => handleAnswerChange(idx, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-700"
                        />
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-yellow-700 text-white py-2 rounded-lg font-semibold hover:bg-yellow-800 transition"
                >
                    {loading ? "Generating Story..." : "📝 Generate Story"}
                </button>
            </div>

            {story.length > 0 && (
                <div className="mt-10 max-w-5xl mx-auto space-y-8">
                    <h2 className="text-xl font-bold text-center text-[#5c3a21]">📖 Your Illustrated Story</h2>
                    {story.map((segment, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={segment.image} alt={`Illustration ${idx + 1}`} className="md:w-1/2 w-full h-48 object-cover" />
                            <div className="p-4 md:w-1/2">
                                <p className="text-gray-800">{segment.paragraph}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatBotInput;
