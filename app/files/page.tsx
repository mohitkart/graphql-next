/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  GET_FILES,
  CREATE_FILE,
  UPDATE_FILE,
  DELETE_FILE,
} from "@/graphql/operations";

type FileType = {
  id: string;
  name: string;
  ext: string;
};

type FilesResponse = {
  files: FileType[];
};

export default function Files() {
  const [name, setName] = useState("");
  const [ext, setExt] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const { data, loading } = useQuery<FilesResponse>(GET_FILES);

  const [createUser] = useMutation(CREATE_FILE, {
    refetchQueries: [GET_FILES],
  });

  const [updateUser] = useMutation(UPDATE_FILE, {
    refetchQueries: [GET_FILES],
  });

  const [deleteUser] = useMutation(DELETE_FILE, {
    refetchQueries: [GET_FILES],
  });

  const handleSubmit = async () => {
    if (editId) {
      await updateUser({
        variables: { id: editId, name, ext },
      });
      setEditId(null);
    } else {
      await createUser({
        variables: { name, ext },
      });
    }

    setName("");
    setExt("");
  };

  const handleEdit = (u: any) => {
    setEditId(u.id);
    setName(u.name);
    setExt(u.ext);
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
        placeholder="ext"
        value={ext}
        onChange={(e) => setExt(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Create"}
      </button>

      <hr />

      {data?.files.map((u: any) => (
        <div key={u.id} className="flex gap-3">
          {u.name}{u.ext}
          <button className="cursor-pointer" onClick={() => handleEdit(u)}>Edit</button>
          <button
          className="cursor-pointer"
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
