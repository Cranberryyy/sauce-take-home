import feedbackStore from "../store/feedback";
import feeedbackService from "../service/feedback";
import { Feedback } from "../store/model";

/**
 * GraphQL Resolvers
 */
const resolvers = {
  Query: {
    feedback: (parent: unknown, args: {id: number}) => {
      return feedbackStore.getFeedback(args.id)
    },
    feedbacks: (parent: unknown, args: { page: number; per_page: number }) => {
      return feedbackStore.getFeedbackPage(args.page, args.per_page); 
    },
  },
  Mutation: {
    createFeedback: (parent: unknown, args: { text: string }) => {
      return feeedbackService.createFeedback(args.text)
    }
  },
  Feedback: {
    highlights: (parent: Feedback) => {
      return feedbackStore.getFeedbackHighlights(parent.id)
    }
  }
};

export default resolvers;