import { useState } from "react";
import { generateStory, submitAnswers } from "../utils/api";

const questions = [
    "What is your story idea?",
    "Who are the main characters?",
    "What conflict or challenge do they face?",
    "How does the story end?",
];

export default function ChatBot({
    onStoryGenerated,
}) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [input, setInput] = useState("");

    const handleNext = async () => {
        if (!input.trim()) return;
        const updatedAnswers = [...answers, input];
        setAnswers(updatedAnswers);
        setInput("");

        if (step === questions.length - 1) {
            const response = await submitAnswers({
                user_id: 1,
                ans1: updatedAnswers[0],
                ans2: updatedAnswers[1],
                ans3: updatedAnswers[2],
                ans4: updatedAnswers[3],
            });
            const storyData = await generateStory(response.query_id);
            onStoryGenerated(JSON.parse(storyData.story));
        } else {
            setStep(step + 1);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col justify-between">
            <div className="text-lg font-medium mb-2">{questions[step]}</div>
            <textarea
                className="border p-2 rounded resize-none w-full h-32"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700"
                onClick={handleNext}
            >
                {step === questions.length - 1 ? "Submit" : "Next"}
            </button>
        </div>
    );
}