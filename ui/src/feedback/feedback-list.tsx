import { useEffect, useState } from "react";
import { Feedback, feedbacksQuery, feedbacksAndHighlightsQuery } from "./api.ts";

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbacksWithHighlights, setFeedbacksWithHighlights] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null); // Reset errors when page changes
  
    // Fetch feedbacks
    feedbacksQuery(page, 10)
      .then((result) => {
        console.log("✅ Feedbacks API response:", result);
  
        if (Array.isArray(result?.feedbacks)) {
          setFeedbacks(result.feedbacks); // Use feedbacks directly, NOT feedbacks.values
        } else {
          console.error("⚠️ Unexpected feedbacks API structure:", result);
          setError("Unexpected response structure from feedbacks API.");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch feedbacks:", err);
        setError("Failed to fetch feedbacks from the backend.");
      });
  
    // Fetch feedbacks with highlights
    feedbacksAndHighlightsQuery(page, 10)
      .then((result) => {
        console.log("✅ Feedbacks with Highlights API response:", result);
  
        if (Array.isArray(result?.feedbacks)) {
          setFeedbacksWithHighlights(result.feedbacks); // Use feedbacks directly
        } else {
          console.error("⚠️ Unexpected feedbacksWithHighlights API structure:", result);
          setError("Unexpected response structure from feedbacksWithHighlights API.");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch feedbacks with highlights:", err);
        setError("Failed to fetch feedbacks with highlights from the backend.");
      });
  }, [page]);
  

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Feedback</h1>
      {error && <p className="text-red-500">⚠️ {error}</p>}

      {feedbacks.length === 0 && !error ? (
        <p className="text-gray-400">No feedback available</p>
      ) : (
        feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left">
            <p className="text-red-300"><strong>ID:</strong> {feedback.id}</p>
            <p className="text-white"><strong>Text:</strong> {feedback.text}</p>
          </div>
        ))
      )}

      <h1 className="text-2xl font-semibold">Feedback with Highlights</h1>

      {feedbacksWithHighlights.length === 0 && !error ? (
        <p className="text-gray-400">No highlighted feedback available</p>
      ) : (
        feedbacksWithHighlights.map((feedback) => (
          <div key={feedback.id} className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left">
            <p className="text-red-300"><strong>ID:</strong> {feedback.id}</p>
            <p className="text-white"><strong>Text:</strong> {feedback.text}</p>
            <p className="text-white"><strong>HighLights:</strong></p>
            {feedback.highlights?.map((highlight) => (
              <div key={highlight.id} className="ml-4 mt-2">
                <blockquote className="italic text-blue-300">"{highlight.quote}"</blockquote>
                <p className="text-sm text-gray-400">{highlight.summary}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
