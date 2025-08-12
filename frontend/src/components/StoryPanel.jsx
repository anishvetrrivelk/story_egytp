import { useState } from "react";

export default function StoryPanel({ story }) {
    const [page, setPage] = useState(0);

    return (
        <div className="p-6 h-full overflow-hidden flex flex-col justify-between">
            <div className="text-xl font-bold mb-4">Ancient Egyptian Tale</div>
            <div className="bg-yellow-50 p-4 rounded shadow h-[80%] overflow-y-auto">
                <p className="text-gray-800 leading-relaxed">{story[page]}</p>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-500">
                    Paragraph {page + 1} / {story.length}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, story.length - 1))}
                    disabled={page === story.length - 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}