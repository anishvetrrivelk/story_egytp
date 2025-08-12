import { Bot, ChevronLeft, ChevronRight, Image, Maximize2, Minimize2, Send, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// API Configuration
const API_BASE_URL = 'http://localhost:8000';
const submitAnswers = async (data) => {
    const response = await fetch(`${API_BASE_URL}/submit-answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Backend returned error:", error);
        throw new Error("Failed to submit answers");
    }

    return response.json();
};





const generateStory = async (queryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-story/${queryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Raw response:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Parsed JSON:", result);

        // Transform the backend response to match frontend expectations
        if (result && result.story) {
            let storyArray;

            // Parse the story string into an array
            try {
                storyArray = JSON.parse(result.story);
            } catch (e) {
                console.error("Failed to parse story JSON:", e);
                return null;
            }

            // Transform into the expected format
            const transformedStory = {
                title: "Your Ancient Egyptian Tale",
                slides: storyArray.map((paragraph, index) => ({
                    content: paragraph,
                    image: `An ancient Egyptian scene depicting: ${paragraph.substring(0, 100)}...`
                }))
            };

            console.log("Transformed story:", transformedStory);
            return transformedStory;
        }

        return result;
    } catch (err) {
        console.error("generateStory() failed:", err);
        return null;
    }
};


const questions = [
    "Hi there! I'm your Story Assistant. Let's create an amazing story together! 🎭\n\nWhat is your story idea?",
    "Great idea! Now, who are the main characters in your story?",
    "Interesting characters! What conflict or challenge do they face?",
    "Perfect! Finally, how does the story end?"
];

const waitingMessages = [
    "Got it! Thinking deeply about your story idea... 🧠",
    "Finding the best plot twists... 🧩",
    "Adding a dash of magic... ✨",
    "Your story is almost ready! Just polishing it up! 🖋️",
    "Weaving all the elements together... 🧵",
    "Adding the final touches... 🎨",
    "Almost there! Making it perfect... ⭐"
];

const initialMessages = [
    {
        id: 1,
        type: 'bot',
        content: "Hello! Welcome to Story Assistant! I'm here to help you create an amazing story. Are you ready to begin? 🚀",
        timestamp: new Date()
    }
];




// Draggable ChatBot Component
function ChatBot({ onStoryGenerated, isMinimized, onToggleMinimize, onClose }) {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [generatedStory, setGeneratedStory] = useState(null);
    const [currentWaitingMessageIndex, setCurrentWaitingMessageIndex] = useState(-1);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const messagesEndRef = useRef(null);
    const [generatedImages, setGeneratedImages] = useState(Array(10).fill(null));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const simulateTyping = (callback, delay = 1500) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            callback();
        }, delay);
    };

    const addBotMessage = (content) => {
        const newMessage = {
            id: messages.length + 1,
            type: 'bot',
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const addUserMessage = (content) => {
        const newMessage = {
            id: messages.length + 1,
            type: 'user',
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // Function to display waiting messages sequentially
    const showWaitingMessages = async () => {
        for (let i = 0; i < waitingMessages.length; i++) {
            setCurrentWaitingMessageIndex(i);

            await new Promise(resolve => {
                simulateTyping(() => {
                    addBotMessage(waitingMessages[i]);
                    resolve();
                }, 1200);
            });

            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userInput = input.trim();
        setInput("");

        addUserMessage(userInput);

        if (!hasStarted) {
            setHasStarted(true);
            simulateTyping(() => {
                addBotMessage(questions[0]);
                setCurrentQuestionIndex(0);
            });
            return;
        }

        const updatedAnswers = [...answers, userInput];
        setAnswers(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            simulateTyping(() => {
                addBotMessage(questions[nextIndex]);
                setCurrentQuestionIndex(nextIndex);
            });
        } else {
            setIsGenerating(true);
            simulateTyping(() => {
                addBotMessage("Perfect! I have all the information I need. Let me generate your story now... ✨");
            }, 1000);

            setTimeout(async () => {
                await showWaitingMessages();

                setTimeout(async () => {
                    try {

                        const user_id = Number(localStorage.getItem("user_id")); // or parseInt()

                        const payload = {
                            user_id,
                            ans1: updatedAnswers[0],
                            ans2: updatedAnswers[1],
                            ans3: updatedAnswers[2],
                            ans4: updatedAnswers[3],
                        };

                        const { query_id } = await submitAnswers(payload);

                        const story = await generateStory(query_id);

                        if (story) {
                            setIsGenerating(false);
                            setIsCompleted(true);
                            setGeneratedStory(story);
                            setCurrentWaitingMessageIndex(-1);
                        }

                        simulateTyping(() => {
                            addBotMessage("🎉 Your story is ready! I've generated it based on your creative inputs. Check it out!");
                        }, 1000);

                        if (onStoryGenerated) {
                            onStoryGenerated(story);
                        }

                    } catch (error) {
                        setIsGenerating(false);
                        setCurrentWaitingMessageIndex(-1);
                        addBotMessage("I'm sorry, there was an error generating your story. Please try again later.");
                    }
                }, 1000);
            }, 2000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleStartNew = () => {
        setMessages(initialMessages);
        setInput("");
        setCurrentQuestionIndex(-1);
        setAnswers([]);
        setIsTyping(false);
        setHasStarted(false);
        setIsGenerating(false);
        setIsCompleted(false);
        setGeneratedStory(null);
        setCurrentWaitingMessageIndex(-1);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Drag handlers
    const handleMouseDown = (e) => {
        if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);

    if (isMinimized) {
        return (
            <div
                className="fixed z-50"
                style={{ left: position.x, top: position.y }}
                onMouseDown={handleMouseDown}
            >
                <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-2xl shadow-2xl border-4 border-yellow-400 overflow-hidden w-80 max-h-96 egyptian-border">
                    <div className="bg-gradient-to-r from-amber-700 to-yellow-700 p-3 flex items-center justify-between drag-handle cursor-move">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-amber-800" />
                            </div>
                            <span className="text-yellow-100 font-bold text-sm">𓂀 Story Assistant</span>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={onToggleMinimize}
                                className="text-yellow-100 hover:bg-yellow-600/30 p-1 rounded-lg transition-colors"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="text-yellow-100 hover:bg-red-600/30 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3 max-h-60 overflow-y-auto bg-gradient-to-b from-yellow-50 to-amber-50">
                        <div className="text-sm text-amber-800 mb-2 flex items-center gap-1">
                            <span className="text-lg">𓋹</span>
                            {isCompleted ? "Story completed! 🎉" : "Chat in progress..."}
                        </div>
                        {isCompleted && (
                            <button
                                onClick={handleStartNew}
                                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-yellow-100 px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all border-2 border-yellow-400"
                            >
                                𓂀 Create New Story
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 egyptian-bg">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 border-b-4 border-yellow-400 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
                                <Bot className="w-6 h-6 text-amber-800" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-yellow-100 flex items-center gap-2">
                                <span className="text-2xl">𓂀</span>
                                Story Assistant
                            </h2>
                            <p className="text-xs text-yellow-200 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                {isGenerating ? "Crafting your tale..." : "Ready to create"}
                            </p>
                        </div>
                    </div>
                    {isCompleted && (
                        <button
                            onClick={onToggleMinimize}
                            className="text-yellow-100 hover:bg-yellow-600/30 p-2 rounded-lg transition-colors"
                        >
                            <Minimize2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-end gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400'
                            : 'bg-gradient-to-r from-amber-600 to-yellow-600 border-yellow-400'
                            }`}>
                            {message.type === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <Bot className="w-4 h-4 text-yellow-100" />
                            )}
                        </div>

                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-3 rounded-2xl shadow-lg border-2 ${message.type === 'user'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm border-blue-400'
                                : 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 text-amber-900 rounded-bl-sm'
                                }`}>
                                <div className="text-sm whitespace-pre-line leading-relaxed">
                                    {message.content}
                                </div>
                            </div>
                            <div className={`text-xs text-amber-600 mt-1 px-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-end gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center border-2 border-yellow-400">
                            <Bot className="w-4 h-4 text-yellow-100" />
                        </div>
                        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {isGenerating && currentWaitingMessageIndex >= 0 && (
                <div className="mx-4 mb-4">
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-yellow-300 rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center border-2 border-yellow-400">
                                    <span className="text-yellow-100 text-sm">𓋹</span>
                                </div>
                                <span className="text-sm font-bold text-amber-800">Creating Your Ancient Tale</span>
                            </div>
                            <span className="text-xs text-amber-600">{currentWaitingMessageIndex + 1} / {waitingMessages.length}</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2 border border-yellow-300">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                                style={{ width: `${((currentWaitingMessageIndex + 1) / waitingMessages.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {hasStarted && currentQuestionIndex >= 0 && !isCompleted && (
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 border-t-2 border-yellow-300">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-amber-800">Progress</span>
                        <span className="text-xs text-amber-600">{Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}</span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-1 border border-yellow-300">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${(Math.min(currentQuestionIndex + 1, questions.length) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {!isCompleted && (
                <div className="p-4 bg-gradient-to-r from-yellow-100 to-amber-100 border-t-2 border-yellow-300">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                className="w-full max-h-32 p-3 pr-12 border-2 border-yellow-300 rounded-2xl resize-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 text-amber-900 placeholder-amber-500 bg-gradient-to-r from-yellow-50 to-amber-50"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={hasStarted ? "Share your thoughts..." : "Type 'yes' or 'start' to begin the journey..."}
                                rows={1}
                                disabled={isGenerating}
                                style={{
                                    minHeight: '48px',
                                    height: 'auto'
                                }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                }}
                            />
                        </div>
                        <button
                            className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-600 text-yellow-100 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 border-2 border-yellow-400"
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping || isGenerating}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-xs text-amber-600 mt-2 text-center">
                        {isGenerating ? "Weaving your ancient tale..." : "Press Enter to send • Shift + Enter for new line"}
                    </div>
                </div>
            )}
        </div>
    );
}

// Egyptian-styled StorySlider Component  
function StorySlider({ story, currentSlide, onSlideChange }) {
    if (!story || !story.slides) return null;

    const nextSlide = () => {
        const next = (currentSlide + 1) % story.slides.length;
        onSlideChange(next);
    };

    const prevSlide = () => {
        const prev = (currentSlide - 1 + story.slides.length) % story.slides.length;
        onSlideChange(prev);
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 egyptian-bg">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 border-b-4 border-yellow-400 p-4 shadow-lg">
                <h2 className="text-2xl font-bold text-yellow-100 mb-2 flex items-center gap-2">
                    <span className="text-3xl">𓋹</span>
                    {story.title}
                </h2>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-200 flex items-center gap-1">
                        <span className="text-lg">𓎢</span>
                        Scroll {currentSlide + 1} of {story.slides.length}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={prevSlide}
                            className="p-2 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors border-2 border-yellow-300 text-amber-800"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-2 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors border-2 border-yellow-300 text-amber-800"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 flex items-center justify-center">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl shadow-xl p-8 border-4 border-yellow-300 relative">
                        <div className="absolute top-2 left-2 text-2xl text-amber-600">𓈖</div>
                        <div className="absolute top-2 right-2 text-2xl text-amber-600">𓈖</div>
                        <div className="absolute bottom-2 left-2 text-2xl text-amber-600">𓈖</div>
                        <div className="absolute bottom-2 right-2 text-2xl text-amber-600">𓈖</div>

                        <p className="text-lg leading-relaxed text-amber-900 text-center font-serif px-4">
                            {story.slides[currentSlide].content}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-100 to-amber-100 border-t-2 border-yellow-300">
                <div className="flex justify-center gap-2">
                    {story.slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => onSlideChange(index)}
                            className={`w-3 h-3 rounded-full transition-all border-2 ${index === currentSlide
                                ? 'bg-amber-600 scale-125 border-yellow-400'
                                : 'bg-yellow-300 hover:bg-yellow-400 border-yellow-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Egyptian-styled ImagePanel Component

function ImagePanel({ story, currentSlide }) {
    if (!story || !story.slides) return null;

    const currentSlideData = story.slides[currentSlide];
    const [loading, setLoading] = useState(true);

    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        const fetchImage = async () => {
            if (!currentSlideData || !currentSlideData.image) return;

            setLoading(true);
            setImageUrl(null); // Hide previous image while loading new one

            try {
                const response = await fetch("http://localhost:8000/generate-image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ story_text: currentSlideData.image }),
                });

                const data = await response.json();
                setImageUrl(data.image_url);
            } catch (error) {
                console.error("Error fetching image:", error);
                setImageUrl(null);
            } finally {
                setLoading(false); // Done loading
            }
        };

        fetchImage();
    }, [currentSlideData]);

    {
        loading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                Generating image...
            </div>
        ) : (
            <img
                src={imageUrl}
                alt="Generated"
                className="w-full h-full object-cover transition-opacity duration-500"
            />
        )
    }




    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 egyptian-bg">
            <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 border-b-4 border-orange-400 p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center border-2 border-orange-300">
                        <Image className="w-5 h-5 text-orange-800" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-orange-100 flex items-center gap-2">
                            <span className="text-2xl">𓊪</span>
                            Ancient Visions
                        </h2>
                        <p className="text-xs text-orange-200">
                            Scroll {currentSlide + 1} Illustration
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 flex items-center justify-center">
                <div className="w-full max-w-lg">
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-xl overflow-hidden border-4 border-orange-300 egyptian-border relative">
                        <div className="absolute top-2 left-2 text-xl text-orange-600">𓊪</div>
                        <div className="absolute top-2 right-2 text-xl text-orange-600">𓊪</div>
                        <div className="absolute bottom-2 left-2 text-xl text-orange-600">𓊪</div>
                        <div className="absolute bottom-2 right-2 text-xl text-orange-600">𓊪</div>

                        <div className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center relative">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-orange-400">
                                    <Image className="w-8 h-8 text-orange-100" />
                                </div>
                                <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center justify-center gap-1">
                                    <span className="text-xl">𓋹</span>
                                    Generated Vision
                                </h3>
                                <div className="relative">
                                    {loading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-xl z-10">
                                            <p className="text-orange-600 text-sm font-bold italic">Generating image...</p>
                                        </div>
                                    )}
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="Generated vision"
                                            className={`w-full h-auto rounded-xl border-2 border-orange-300 transition-all duration-300 ${loading ? 'blur-sm scale-95' : 'blur-0 scale-100'}`}
                                        />
                                    )}
                                </div>


                            </div>

                            {/* Egyptian decorative elements */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl text-orange-400/50">𓈖</div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl text-orange-400/50">𓈖</div>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-orange-400/50">𓎢</div>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-orange-400/50">𓎢</div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-200 to-amber-200 border-t-2 border-orange-300">
                            <div className="flex items-center justify-center gap-2 text-xs text-orange-700">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <span className="font-bold">𓊪 Vision synchronized with scroll {currentSlide + 1}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-orange-100 to-amber-100 border-t-2 border-orange-300">
                <div className="text-center">
                    <p className="text-xs text-orange-600 mb-2 font-bold flex items-center justify-center gap-1">
                        <span className="text-sm">𓋹</span>
                        Vision Description:
                    </p>
                    <p className="text-sm text-orange-800 italic font-serif bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border-2 border-orange-200">
                        "{currentSlideData.image}"
                    </p>
                </div>
            </div>
        </div>
    );
}


// CSS for Egyptian styling
const egyptianStyles = `
.egyptian-bg {
  position: relative;
}

.egyptian-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(217, 119, 6, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.egyptian-border {
  position: relative;
  background: linear-gradient(45deg, transparent 10px, currentColor 10px, currentColor 12px, transparent 12px),
              linear-gradient(-45deg, transparent 10px, currentColor 10px, currentColor 12px, transparent 12px);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px;
}

.egyptian-border::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #f59e0b, #d97706, #92400e, #f59e0b);
  border-radius: inherit;
  z-index: -1;
}
`;

// Main App Component
export default function StoryApp() {
    const [story, setStory] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [showChat, setShowChat] = useState(true);


    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = egyptianStyles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);
    const handleStoryGenerated = async (generatedStory) => {
        setStory(generatedStory); // Set story text
        setCurrentSlide(0);
        setIsChatMinimized(true);

        // ✅ EXTRACT 10 image prompts from the story
        const prompts = generatedStory.pages.map((page) => page.description); // Adjust this based on your story format

        // ✅ Send to backend for image generation
        try {
            const response = await fetch('http://localhost:8000/generate-images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompts }),
            });

            const data = await response.json();

            if (data && data.images) {
                setGeneratedImages(data.images); // Set images in state
            } else {
                console.error("No images returned");
            }
        } catch (err) {
            console.error("Error generating images:", err);
        }
    };


    const handleSlideChange = (slideIndex) => {
        setCurrentSlide(slideIndex);
    };

    const toggleChatMinimize = () => {
        setIsChatMinimized(!isChatMinimized);
    };

    const handleCloseChat = () => {
        setShowChat(false);
    };

    // Before story is generated - show full ChatBot
    if (!story) {
        return (
            <div className="h-screen bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100">
                {showChat && (
                    <ChatBot
                        onStoryGenerated={handleStoryGenerated}
                        isMinimized={false}
                        onToggleMinimize={toggleChatMinimize}
                        onClose={handleCloseChat}
                    />
                )}
            </div>
        );
    }

    // After story is generated - show proper 50/50 split layout
    // After story is generated - show StorySlider on full screen LEFT, ImagePanel on RIGHT
    return (
        <div className="h-screen flex bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100">
            {/* Left Half - StorySlider now comes where ChatBot was */}
            <div className="w-1/2 h-full">
                <StorySlider
                    story={story}
                    currentSlide={currentSlide}
                    onSlideChange={handleSlideChange}
                />
            </div>

            {/* Right Half - ImagePanel */}
            <div className="w-1/2 h-full border-l-4 border-orange-300">
                <ImagePanel
                    story={story}
                    currentSlide={currentSlide}
                />
            </div>
            {/* ADD THIS BLOCK FOR MINIMIZED CHAT */}
            {showChat && isChatMinimized && (
                <ChatBot
                    onStoryGenerated={handleStoryGenerated}
                    isMinimized={true}
                    onToggleMinimize={toggleChatMinimize}
                    onClose={handleCloseChat}
                />
            )}
        </div>
    );
}

