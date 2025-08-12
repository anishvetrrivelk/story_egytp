const BASE_URL = "http://localhost:8000";

export const submitAnswers = async (payload) => {
    const res = await fetch(`${BASE_URL}/submit-answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit answers");
    return await res.json();
};

export const generateStory = async (query_id) => {
    const res = await fetch(`${BASE_URL}/generate-story/${query_id}`);
    if (!res.ok) throw new Error("Failed to generate story");
    return await res.json();
};