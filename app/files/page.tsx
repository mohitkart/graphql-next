/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  GET_FILES,
  CREATE_FILE,
  UPDATE_FILE,
  DELETE_FILE,
} from "@/graphql/operations";
import MKTable from "@/components/MkTable";
import { dateTimePipe } from "@/lib/shared";
import Modal from "@/components/Modal";
import { useDebounce } from "@/hooks/debounce";

type FileType = {
  id: string;
  name: string;
  ext: string;
};

type FilesResponse = {
  files: FileType[];
};

export default function Files() {
  const [editId, setEditId] = useState<string | null>(null);
  const [formModal, setFormModal] = useState<any>();
  const [filters, setFilters] = useState<{search:string}>({search:''});
  const debouncedText = useDebounce(filters.search, 500);

  const { data, loading,refetch } = useQuery<FilesResponse>(GET_FILES, {
    variables: { search: debouncedText },
  });

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
        variables: { id: editId, name: formModal.name, ext: formModal.ext },
      });
      setEditId(null);
    } else {
      await createUser({
        variables: { name: formModal.name, ext: formModal.ext },
      });
    }

    setFormModal('')
  };

  const handleEdit = (u: any) => {
    setEditId(u.id);
    setFormModal({
      name: u.name,
      ext: u.ext
    });
  };

  const columns = [
    {
      name: 'Name',
      key: 'name',
      render: (item: any) => item.name
    },
    {
      name: 'Ext',
      key: 'ext',
      render: (item: any) => item.ext
    },
    {
      name: 'Created At',
      key: 'createdAt',
      render: (item: any) => dateTimePipe(item.createdAt)
    },
    {
      name: 'Actions',
      key: 'actions',
      render: (item: any) => <>
        <button onClick={() => handleEdit(item)} className="mr-2 text-blue-500 cursor-pointer">Edit</button>
        <button onClick={async () => {
          await deleteUser({ variables: { id: item.id } })
        }} className="text-red-500 cursor-pointer">Delete</button>
      </>
    }
  ]

  const addUser = () => {
    setEditId('')
    setFormModal({
      name: '',
      ext: ''
    });
  }
  useEffect(() => {
    refetch({variables: { search: debouncedText }});
  }, [debouncedText]);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Files Management</h1>
        <p className="text-gray-600 mt-2">Manage your file records with search, filter, and action options</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
              id="searchInput"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="Search by name"
            />
          </div>


          <div className="flex gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select id="statusFilter" className="appearance-none w-full sm:w-48 pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <button id="addButton"
              onClick={() => addUser()}
              className="bg-blue-500 hover:bg-secondary cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 whitespace-nowrap">
              <i className="fas fa-plus"></i>
              Add New File
            </button>
          </div>


        </div>

        <div id="activeFilters" className="mt-4 flex flex-wrap gap-2 hidden">
          <span className="text-sm text-gray-600 mr-2">Active filters:</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <MKTable
          columns={columns}
          data={data?.files || []}
          total={data?.files?.length || 0}
          isLoading={loading}
          count={5}
        />
      </div>
      {formModal ? <Modal
        onResult={e => setFormModal('')}
        body={<form id="userForm"
          onSubmit={e=>{e.preventDefault(); handleSubmit()}}
          className="p-6 space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" id="userName"
              value={formModal.name}
              onChange={e => setFormModal((prev: any) => ({ ...prev, name: e.target.value }))}
              required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ext</label>
            <input type="text"
              value={formModal.ext}
              onChange={e => setFormModal((prev: any) => ({ ...prev, ext: e.target.value }))}
              required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => setFormModal('')}
            >Cancel</button>
            <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >Save</button>
          </div>
        </form>}
      /> : null}
    </div>
  );
}
