/**
 * GraphQL type definitions
 */
const typeDefs = /* GraphQL */ `
  scalar ID

  type Query {
    feedback(id: ID!): Feedback
    feedbacks(page: Int!, per_page: Int!): [Feedback]
  }
  
  type Mutation {
    createFeedback(text: String!): Feedback!
  }

  type Feedback {
    id: ID!
    text: String!
    highlights: [Highlight!]
  }

  type Highlight {
    id: ID!
    quote: String!
    summary: String!
  }

  type FeedbackPage {
    values: [Feedback!]!
    count: Int!
  }
`;

export default typeDefs;