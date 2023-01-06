const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    user: User
  }

  type Mutation {
    createMatchup(tech1: String!, tech2: String!): Matchup
    createVote(_id: String!, techNum: Int!): Matchup
  }
`;

module.exports = typeDefs;
