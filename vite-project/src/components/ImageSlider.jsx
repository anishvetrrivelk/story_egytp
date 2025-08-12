import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const ImageSlider = ({ images }) => {
    const [index, setIndex] = useState(0);

    const next = () => {
        setIndex((prev) => (prev + 1 < images.length ? prev + 1 : prev));
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    };

    return (
        <div className="flex flex-col h-full justify-between items-center">
            <img
                src={images[index]}
                alt={`Slide ${index + 1}`}
                className="max-w-full max-h-[75vh] rounded shadow"
            />
            <div className="flex justify-between items-center w-full mt-4">
                <button onClick={prev} disabled={index === 0} className="p-2 text-gray-600">
                    <ChevronLeft size={24} />
                </button>
                <span className="text-sm text-gray-500">
                    {index + 1}/{images.length}
                </span>
                <button onClick={next} disabled={index === images.length - 1} className="p-2 text-gray-600">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default ImageSlider;
