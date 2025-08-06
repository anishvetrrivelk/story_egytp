import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const StorySlider = ({ storyParagraphs }) => {
    const [index, setIndex] = useState(0);

    const next = () => {
        setIndex((prev) => (prev + 1 < storyParagraphs.length ? prev + 1 : prev));
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="text-lg text-gray-700 leading-relaxed">{storyParagraphs[index]}</div>
            <div className="flex justify-between mt-4">
                <button onClick={prev} disabled={index === 0} className="p-2 text-gray-600">
                    <ChevronLeft size={24} />
                </button>
                <span className="text-sm text-gray-500">
                    {index + 1}/{storyParagraphs.length}
                </span>
                <button onClick={next} disabled={index === storyParagraphs.length - 1} className="p-2 text-gray-600">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default StorySlider;
