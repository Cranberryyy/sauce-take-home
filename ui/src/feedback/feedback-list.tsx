import { useEffect, useState } from "react";
import { Feedback, feedbacksQuery, feedbacksAndHighlightsQuery } from "./api.ts";

export default function FeedbackList() {
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [highlightPage, setHighlightPage] = useState(1);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
  const [highlightTotalPages, setHighlightTotalPages] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbacksWithHighlights, setFeedbacksWithHighlights] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const PER_PAGE = 2; // Number of feedback items per page

  // useEffect(() => {
  //   setError(null);

  //   // Fetch feedbacks
  //   feedbacksQuery(feedbackPage, PER_PAGE)
  //     .then((result) => {
  //       console.log("✅ Feedbacks API response:", result);
  //       if (Array.isArray(result?.feedbacks.values)) {
  //         setFeedbacks(result.feedbacks.values);
  //         setFeedbackTotalPages(Math.ceil(result.feedbacks.count / PER_PAGE));
  //       } else {
  //         console.error("⚠️ Unexpected feedbacks API structure:", result);
  //         setError("Unexpected response structure from feedbacks API.");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("❌ Failed to fetch feedbacks:", err);
  //       setError("Failed to fetch feedbacks from the backend.");
  //     });
  // }, [feedbackPage]);

  useEffect(() => {
    setError(null);

    // Fetch feedbacks with highlights
    feedbacksAndHighlightsQuery(highlightPage, PER_PAGE)
    .then((result) => {
      console.log("✅ Feedbacks with Highlights API response:", result);
      if (Array.isArray(result?.feedbacks.values)) { // Change here
        setFeedbacksWithHighlights(result.feedbacks.values);
        setHighlightTotalPages(Math.ceil(result.feedbacks.count / PER_PAGE)); 
      } else {
        console.error("⚠️ Unexpected feedbacksWithHighlights API structure:", result);
        setError("Unexpected response structure from feedbacksWithHighlights API.");
      }
    })
    .catch((err) => {
      console.error("❌ Failed to fetch feedbacks with highlights:", err);
      setError("Failed to fetch feedbacks with highlights from the backend.");
    });
  
  }, [highlightPage]);

  return (
    <div className="space-y-4">
      {/* <h1 className="text-2xl font-semibold">Feedback</h1>
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
      )} */}

      {/* <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setFeedbackPage((prev) => Math.max(prev - 1, 1))}
          disabled={feedbackPage === 1}
          className={`px-4 py-2 rounded-lg ${feedbackPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
        >
          Previous
        </button>
        <span className="text-white">Page {feedbackPage} of {feedbackTotalPages}</span>
        <button
          onClick={() => setFeedbackPage((prev) => prev + 1)}
          disabled={feedbackPage >= feedbackTotalPages}
          className={`px-4 py-2 rounded-lg ${feedbackPage >= feedbackTotalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
        >
          Next
        </button>
      </div> */}

      <h1 className="text-2xl font-semibold">Feedback with Highlights</h1>

      {feedbacksWithHighlights.length === 0 && !error ? (
        <p className="text-gray-400">No highlighted feedback available</p>
      ) : (
        feedbacksWithHighlights.map((feedback) => (
          <div key={feedback.id} className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left">
            <p className="text-red-300"><strong>ID:</strong> {feedback.id}</p>
            <p className="text-white"><strong>Text:</strong> {feedback.text}</p>
            <p className="text-white"><strong>Highlights:</strong></p>
            {feedback.highlights?.map((highlight) => (
              <div key={highlight.id} className="ml-4 mt-2">
                <blockquote className="italic text-blue-300">"{highlight.quote}"</blockquote>
                <p className="text-sm text-gray-400">{highlight.summary}</p>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Pagination Controls for Feedback with Highlights */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setHighlightPage((prev) => Math.max(prev - 1, 1))}
          disabled={highlightPage === 1}
          className={`px-4 py-2 rounded-lg ${highlightPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
        >
          Previous
        </button>
        <span className="text-white">Page {highlightPage} of {highlightTotalPages}</span>
        <button
          onClick={() => setHighlightPage((prev) => prev + 1)}
          disabled={highlightPage >= highlightTotalPages}
          className={`px-4 py-2 rounded-lg ${highlightPage >= highlightTotalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
