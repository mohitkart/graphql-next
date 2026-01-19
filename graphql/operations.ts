import { gql } from "@apollo/client/core";

export const GET_USERS = gql`
  query {
    users {
      id
      name
      email
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
