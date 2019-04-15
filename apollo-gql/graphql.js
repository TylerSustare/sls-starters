const { ApolloServer, gql } = require('apollo-server-lambda');
const _ = require('lodash');

const names = [
  { first: 'John', last: 'Snow' },
  { first: 'Daenerys', last: 'Targaryen' },
  { first: 'Arya', last: 'Stark' },
  { first: 'Tyrion', last: 'Lanister' }
]

// Construct a schema, using GraphQL schema language
const typeDefs = gql `
  type Query {
    hello(name: String): String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    //hello: (parent, args, context, info) => `parent:${parent}, args:${args}, context:${context}, info:${info}`,
    hello: (parent, args, context, info) => {
      try {
        return `Hello ${args.name} ${_.find(names, {first: args.name}).last}`;
      }
      catch (e) {
        return 'Unable to get name';
      }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
