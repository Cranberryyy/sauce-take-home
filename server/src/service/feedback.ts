import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";
import { highlightQueue, redisConfig } from "./queue";
import { Worker } from "bullmq";


/**
 * Background Worker to Process Highlight Extraction Jobs
 */
const highlightWorker = new Worker(
  "highlightQueue",
  async (job) => {
    const { feedbackId, text } = job.data;
    console.log(`Processing highlight extraction for feedback ID: ${feedbackId}`);

    try {
      const analysisResult = await prompt.runFeedbackAnalysis(text);

      if (analysisResult.highlights && analysisResult.highlights.length > 0) {
        const highlightPromises = analysisResult.highlights.map((hl) =>
          feedbackStore.createHighlight({
            feedbackId,
            highlightSummary: hl.summary,
            highlightQuote: hl.quote,
          })
        );

        await Promise.all(highlightPromises);
        console.log(`Highlight extraction completed for feedback ID: ${feedbackId}`);
      } else {
        console.warn(`No highlights found for feedback ID: ${feedbackId}`);
      }
    } catch (error) {
      console.error(`Error processing highlights for feedback ID ${feedbackId}:`, error);
    }
  },
  { connection: redisConfig }
);


const createHighlightsInBackground = async (feedback: { id: number; text: string }) => {
  try {
    await highlightQueue.add("extractHighlights", {
      feedbackId: feedback.id,
      text: feedback.text,
    });

    console.log(`Queued highlight extraction for feedback ID: ${feedback.id}`);
  } catch (error) {
    console.error(`Error queuing highlight extraction for feedback ID ${feedback.id}:`, error);
  }
};


/**
 * Creates highlights for a feedback entry in the background
 * @param feedback The feedback entry to create highlights for
 */
const createHighlights = async (feedback: { id: number; text: string }) => {
  try {
    const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
    if (analysisResult.highlights && analysisResult.highlights.length > 0) {
      const highlightPromises = analysisResult.highlights.map((hl) =>
        feedbackStore.createHighlight({
          feedbackId: feedback.id,
          highlightSummary: hl.summary,
          highlightQuote: hl.quote,
        })
      );
      await Promise.all(highlightPromises);
      console.log(`Highlights created successfully for feedback ID: ${feedback.id}`);
    } else {
      console.warn(`No highlights found for feedback ID: ${feedback.id}`);
    }
  } catch (error) {
    console.error(`Error creating highlights for feedback ID ${feedback.id}:`, error);
  }
};


/**
 * Creates a feedback entry and runs analysis on it.
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
  const feedback = await feedbackStore.createFeedback(text);
  createHighlightsInBackground({id: Number(feedback.id), text: feedback.text});
  return feedback;
};


/**
 * Creates multiple feedback entries without waiting for highlight creation
 * @param texts The feedback texts to create
 */
const createFeedbacks = async (texts: string[]) => {
  const feedbacks = await Promise.all(texts.map(text => feedbackStore.createFeedback(text)));
  feedbacks.forEach(feedback => createHighlights({id: Number(feedback.id), text: feedback.text}));
  return feedbacks;
};

/**
 * Gets a page of feedback entries
 * @param page The page number
 * @param perPage The number of entries per page
 */
const getFeedbackPage = async (page: number, perPage: number) => {
  const { values, count } = await feedbackStore.getFeedbackPage(page, perPage);
  return { values, count };
};

export default {
  createFeedback,
  createFeedbacks,
  getFeedbackPage,
};