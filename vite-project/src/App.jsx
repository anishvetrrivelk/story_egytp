import { useState } from "react";
import Home from "./pages/Home";
import StoryViewPage from "./pages/StoryViewPage"; // ⬅️ new import

function App() {
  const [showStoryView, setShowStoryView] = useState(false);

  // Simulate a story being ready — in real flow, trigger this from chatbot after 4 Q&A
  const handleStoryReady = () => {
    setShowStoryView(true);
  };

  return (
    <div className="w-full h-screen bg-white text-gray-900">
      {showStoryView ? (
        <StoryViewPage />
      ) : (
        <Home onStoryReady={handleStoryReady} />
      )}
    </div>
  );
}

export default App;
