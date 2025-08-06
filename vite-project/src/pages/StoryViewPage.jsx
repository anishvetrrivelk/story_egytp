import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import StorySlider from "../components/StorySlider";

const StoryViewPage = () => {
    const { id } = useParams();
    const [storyData, setStoryData] = useState(null);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await fetch(`http://localhost:8000/story/generate-story/${id}`);
                const data = await res.json();
                setStoryData(data);
            } catch (error) {
                console.error("Error fetching story:", error);
            }
        };
        fetchStory();
    }, [id]);

    if (!storyData) return <div className="text-center mt-20">Loading story...</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left: Story Paragraphs */}
            <div className="w-1/2 p-8 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">📖 Your Story</h1>
                <StorySlider storyParagraphs={storyData.story_paragraphs} />
            </div>

            {/* Right: Images */}
            <div className="w-1/2 p-8 overflow-y-auto bg-white border-l border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">🖼️ Visuals</h1>
                <ImageSlider images={storyData.generated_images} />
            </div>
        </div>
    );
};

export default StoryViewPage;
