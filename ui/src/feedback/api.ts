import { gql, request } from "graphql-request";

export type Feedback = {
  id: number;
  text: string;
  highlights?: {
    id: number;
    quote: string;
    summary: string;
  }[];
};

const feedbacksAndHighlightDocument = gql`
query ($page: Int!, $per_page: Int!) {
  feedbacks(page: $page, per_page: $per_page) {
    values {
      id
      text
      highlights {
        id
        quote
        summary
      }
    }
    count
  }
}
`;

const feedbacksDocument = gql`
query ($page: Int!, $per_page: Int!) {
  feedbacks(page: $page, per_page: $per_page) {
    values {
      id
      text
    }
    count
  }
}
`;

type FeedbacksAndHighlightsData = { feedbacks: { values: Feedback[]; count: number } };
export const feedbacksAndHighlightsQuery = (page: number, per_page: number): Promise<FeedbacksAndHighlightsData> =>
  request("http://localhost:4000/graphql", feedbacksAndHighlightDocument, {
    page,
    per_page,
  });

type FeedbacksData = { feedbacks: { values: Feedback[]; count: number } };
export const feedbacksQuery = (page: number, per_page: number): Promise<FeedbacksData> =>
  request("http://localhost:4000/graphql", feedbacksDocument, {
    page,
    per_page,
  });