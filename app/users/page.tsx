/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "@/graphql/operations";

type User = {
  id: string;
  name: string;
  email: string;
};

type UsersResponse = {
  users: User[];
};

export default function Users() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const { data, loading } = useQuery<UsersResponse>(GET_USERS);

  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [GET_USERS],
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [GET_USERS],
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [GET_USERS],
  });

  const handleSubmit = async () => {
    if (editId) {
      await updateUser({
        variables: { id: editId, name, email },
      });
      setEditId(null);
    } else {
      await createUser({
        variables: { name, email },
      });
    }

    setName("");
    setEmail("");
  };

  const handleEdit = (u: any) => {
    setEditId(u.id);
    setName(u.name);
    setEmail(u.email);
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h1>GraphQL CRUD</h1>

      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Create"}
      </button>

      <hr />

      {data?.users.map((u: any) => (
        <div key={u.id}>
          {u.name} - {u.email}

          <button onClick={() => handleEdit(u)}>Edit</button>

          <button
            onClick={() =>
              deleteUser({ variables: { id: u.id } })
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
