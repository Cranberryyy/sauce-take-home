import db from "./db";
import { Highlight, Feedback} from "../store/model";


type CreateHighlightArgs = {
  feedbackId: number | bigint;
  highlightSummary: string;
  highlightQuote: string;
}

/**
 * Gets a feedback entry by its id
 * @param id The id of the feedback
 */
const getFeedback = async (id: number): Promise<Feedback> => {
  const result = db.prepare(`SELECT id, text FROM Feedback WHERE id = ?`).get(id) as Feedback;
  return result
}

/**
 * Gets a page of feedback entries
 * @param page The page number
 * @param perPage The number of entries per page
 */
const getFeedbackPage = async (page: number, perPage: number): Promise<Feedback[]> => {
  const values = db.prepare(`SELECT id, text
                             FROM Feedback
                             ORDER BY id DESC
                             LIMIT ? OFFSET ?`).all(perPage, (page - 1) * perPage) as Feedback[];;
  return values;
};

/**
 * Gets the highlights of a feedback entry
 * @param feedbackId The id of the feedback
 */
const getFeedbackHighlights = async (feedbackId: number) => {
  return db.prepare(`SELECT *
                     FROM Highlight
                     WHERE feedbackId = ?`).all(feedbackId)
}

/**
 * Counts the number of feedback entries
 * @returns The number of feedback entries
 */

const countFeedback = (): number => {
  const stmt = db.prepare(`SELECT COUNT(*) as count
                          FROM Feedback`);
  
  const result = stmt.get() as { count: number };
  return result.count;
}

/**
 * Creates a new feedback entry
 * @param text The text of the feedback
 */
const createFeedback = async (text: string) => {
  const result = db.prepare(`INSERT INTO Feedback (text)
                             VALUES (?)`).run(text);
  return {id: result.lastInsertRowid, text}
}

/**
 * Creates a new highlight entry
 * @param args The arguments to create a highlight
 */
const createHighlight = async (args: CreateHighlightArgs): Promise<Highlight> => {
  const result = db.prepare(`INSERT INTO Highlight (quote, summary, feedbackId)
                             VALUES (?, ?, ?)`).run(args.highlightQuote, args.highlightSummary, args.feedbackId);

  const highlight: Highlight = {
    id: Number(result.lastInsertRowid),
    feedbackId: Number(args.feedbackId),
    summary: args.highlightSummary,
    quote: args.highlightQuote,
  };

  return highlight;
}

export default {getFeedback, getFeedbackPage, createFeedback, createHighlight, getFeedbackHighlights};






// /** Create the new feedback and highlight of the feedback */
// /**
//  * Creates a new feedback entry
//  * @param text The text of the feedback
//  * @param highlights The highlights of the feedback
//  */
// const createFeedback = async (text: string, highlights: CreateHighlightArgs[]) => {
//   const result = db.prepare(`INSERT INTO Feedback (text) VALUES (?)`).run(text);
//   const feedbackId = result.lastInsertRowid;

//   // Save highlights to the database
//   for (const highlight of highlights) {
//     db.prepare(`INSERT INTO Highlight (quote, summary, feedbackId) VALUES (?, ?, ?)`)
//       .run(highlight.highlightQuote, highlight.highlightSummary, feedbackId);
//   }

//   return { id: feedbackId, text }，highlights;
// };
// export default {getFeedback, getFeedbackPage, createFeedback};