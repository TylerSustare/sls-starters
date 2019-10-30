const { ApolloServer, gql } = require('apollo-server-lambda');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  """ 
  implement house type
  type House {
    name: String!
    members: [Person]!
  }
  """ 

  type Person {
    first: String!
    last: String!
    title: String!
  }

  input NewPerson {
    first: String!
    last: String!
    title: String!
  }

  type Query {
    user(name: String!): String!
    users: [String!]!
  }

  type Mutation {
    createUser(newPerson: NewPerson!): Person!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      try {
        const user = db.get('users')
          .filter({ first: args.name })
          .take(1)
          .value()[0];
        return `${user.first} ${user.last}`;
      } catch (e) {
        return e;
      }
    },

    users: (parent, args, context, info) => {
      const users = db.get('users').value();
      return users.map(user => `${user.first} ${user.last}`);
    }
  },

  Mutation: {
    createUser: (parent, args, context, info) => {
      try {
        const person = { ...args.newPerson };

        if (db.get('users').filter(person).value()[0]) {
          return person;
        }

        db.get('users')
          .push(person)
          .write();
        return person;
      } catch (error) {
        return error;
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
