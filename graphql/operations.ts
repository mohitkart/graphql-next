import { gql } from "@apollo/client/core";

export const GET_USERS = gql`
  query User($search: String) {
  users(search: $search) {
    createdAt
    email
    id
    name
    updatedAt
  }
}
`;

export const CREATE_USER = gql`
  mutation($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id)
  }
`;


export const GET_FILES = gql`
  query {
    files {
      id
      name
      ext,
      createdAt
    }
  }
`;

export const CREATE_FILE = gql`
  mutation($name: String!, $ext: String!) {
    createFile(name: $name, ext: $ext) {
      id
      name
      ext
    }
  }
`;

export const UPDATE_FILE = gql`
  mutation($id: ID!, $name: String, $ext: String) {
    updateFile(id: $id, name: $name, ext: $ext) {
      id
      name
      ext
    }
  }
`;

export const DELETE_FILE = gql`
  mutation($id: ID!) {
    deleteFile(id: $id)
  }
`;