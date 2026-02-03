/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getRandomCode } from "@/lib/shared";

const typeDefs = `#graphql
  type User {
    id: ID
    name: String
    email: String
    createdAt:String
    updatedAt:String
  }
  
  type File {
    id: ID
    name: String
    ext: String
    createdAt:String
    updatedAt:String
  }

  type Query {
    users(search: String): [User]
    user(id: ID!): User
    files: [File]
    file(id: ID!): File
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean
    createFile(name: String!, ext: String!): File
    updateFile(id: ID!, name: String, ext: String): File
    deleteFile(id: ID!): Boolean
  }
  `;


let files = [
  {
    name: 'file1',
    ext: '.png',
    id: '1'
  },
  {
    name: 'file2',
    ext: '.js',
    id: '2'
  }
]

const resolvers = {
  Query: {
    users: async (_: any, { search }: any) => {
      await connectDB();
      if (!search) {
        return User.find().sort({ createdAt: -1 });
      }
      return User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).sort({ createdAt: -1 });
    },
    user: async (_: any, { id }: any) => {
      await connectDB();
      return User.findById(id);
    },
    files: async () => {
      return files;
    },
    file: async (_: any, { id }: any) => {
      return files.find(itm => itm.id == id);
    }
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
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true }
      );
      return updatedUser;
    },
    deleteUser: async (_: any, { id }: any) => {
      await connectDB();
      await User.findByIdAndDelete(id);
      return true;
    },

    createFile: async (_: any, { name, ext }: any) => {
      const payload = {
        name,
        ext,
        id: getRandomCode(6),
        createdAt: new Date().toISOString()
      }
      files.push(payload);
      return payload;
    },
    updateFile: async (_: any, { id, name, ext }: any) => {
      const payload = {
        name,
        ext,
        updatedAt: new Date().toISOString()
      }
      const index = files.findIndex(itm => itm.id == id)
      files[index] = {
        ...files[index],
        ...payload
      }
      return files[index]
    },
    deleteFile: async (_: any, { id }: any) => {
      files = files.filter(itm => itm.id != id)
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
