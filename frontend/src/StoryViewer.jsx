import { useState } from 'react';

export default function StoryViewer({ story }) {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => Math.min(prev + 1, story.length - 1));
    const prev = () => setIndex((prev) => Math.max(prev - 1, 0));

    return (
        <div className="min-h-screen bg-[#fdf6e3] font-serif text-[#3b2e2a] flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-4 text-center text-[#8b5e3c]">📖 The Story of Egypt</h1>

            <div className="flex flex-row w-full max-w-5xl shadow-xl border rounded-lg bg-[#fffef0] overflow-hidden">
                {/* Left panel: Image */}
                <div className="w-1/2 p-4 bg-[#f5deb3] flex items-center justify-center">
                    <img
                        src={`https://via.placeholder.com/400x300.png?text=Scene+${index + 1}`}
                        alt={`Scene ${index + 1}`}
                        className="rounded-xl shadow-lg"
                    />
                </div>

                {/* Right panel: Text */}
                <div className="w-1/2 p-6 text-lg leading-relaxed overflow-y-auto">
                    <p>{story[index]}</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-6 mt-6">
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="px-6 py-2 rounded-full bg-[#d4af37] text-white disabled:opacity-50"
                >
                    ⬅️ Previous
                </button>
                <button
                    onClick={next}
                    disabled={index === story.length - 1}
                    className="px-6 py-2 rounded-full bg-[#d4af37] text-white disabled:opacity-50"
                >
                    Next ➡️
                </button>
            </div>
        </div>
    );
}
