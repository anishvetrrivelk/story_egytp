import { BookOpen, Bookmark, ChevronLeft, ChevronRight, Download, Share } from "lucide-react";
import { useState } from "react";

export default function StoryPanel({ story }) {
    const [page, setPage] = useState(0);

    return (
        <div className="h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Ancient Egyptian Tale</h1>
                            <p className="text-amber-100 text-sm">A mystical journey through time</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                            <Share className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Story Content */}
            <div className="flex-1 p-8 overflow-hidden">
                <div className="bg-white rounded-3xl shadow-2xl border border-amber-200/50 h-full flex flex-col overflow-hidden">
                    {/* Story Header */}
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 border-b border-amber-200/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {page + 1}
                                </div>
                                <span className="text-amber-800 font-medium">Chapter {page + 1}</span>
                            </div>
                            <div className="text-sm text-amber-700 bg-amber-200/50 px-3 py-1 rounded-full">
                                {Math.round(((page + 1) / story.length) * 100)}% Complete
                            </div>
                        </div>
                    </div>

                    {/* Story Text */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-none">
                            <div className="prose prose-lg prose-amber max-w-none">
                                <p className="text-gray-800 leading-relaxed text-lg font-serif first-letter:text-6xl first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                                    {story[page]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-8 pb-4">
                        <div className="bg-amber-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${((page + 1) / story.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="bg-white/80 backdrop-blur-lg border-t border-amber-200/50 p-6">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                        disabled={page === 0}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        Previous
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            {story.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPage(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === page
                                        ? 'bg-amber-500 scale-125'
                                        : index < page
                                            ? 'bg-amber-300 hover:bg-amber-400'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-amber-700 font-medium">
                            Page {page + 1} of {story.length}
                        </span>
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, story.length - 1))}
                        disabled={page === story.length - 1}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Next
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div >
    );
}