/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

const typeDefs = `#graphql
  type User {
    id: ID
    name: String
    email: String
    createdAt:String
    updatedAt:String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      await connectDB();
      return User.find();
    },

    user: async (_: any, { id }: any) => {
      await connectDB();
      return User.findById(id);
    },
  },

  Mutation: {
    createUser: async (_: any, { name, email }: any) => {
      await connectDB();

      const user = await User.create({
        name,
        email,
      });

      return user;
    },

    updateUser: async (_: any, { id, name, email }: any) => {
      await connectDB();

      return User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true }
      );
    },

    deleteUser: async (_: any, { id }: any) => {
      await connectDB();

      await User.findByIdAndDelete(id);

      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export function GET(req: Request) {
  return handler(req);
}

export function POST(req: Request) {
  return handler(req);
}

// export { handler as GET, handler as POST };
