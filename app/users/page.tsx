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
import MKTable from "@/components/MkTable";
import { dateTimePipe } from "@/lib/shared";

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

  const columns=[
    {
      name:'Name',
      key:'name',
      render:(item:any)=>item.name
    },
    {
      name:'Email',
      key:'email',
      render:(item:any)=>item.email
    },
     {
      name:'Created At',
      key:'createdAt',
      render:(item:any)=>dateTimePipe(Number(item.createdAt))
    },
    {
      name:'Actions',
      key:'actions',
      render:(item:any)=><>
        <button onClick={()=>handleEdit(item)} className="mr-2 text-blue-500 cursor-pointer">Edit</button>
        <button onClick={async()=>{
          await deleteUser({variables:{id:item.id}})
        }} className="text-red-500 cursor-pointer">Delete</button>
      </>
    }
  ]

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

      <button onClick={handleSubmit} className="">
        {editId ? "Update" : "Create"}
      </button>

      <hr className="my-4" />

      <MKTable
      columns={columns}
      data={data?.users||[]}
      total={data?.users?.length||0}
      isLoading={loading}
      count={5}
      />
    </div>
  );
}
