/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "@/graphql/operations";
import MKTable from "@/components/MkTable";
import { dateTimePipe } from "@/lib/shared";
import Modal from "@/components/Modal";
import { useDebounce } from "@/hooks/debounce";

type User = {
  id: string;
  name: string;
  email: string;
};

type UsersResponse = {
  users: User[];
};

export default function Users() {
  const [editId, setEditId] = useState<string | null>(null);
  const [formModal, setFormModal] = useState<any>();
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilter] = useState<{ search: string, page: number, count: number, loadMore: any }>({ search: '', page: 1, count: 5, loadMore: 1 });
  const debouncedText = useDebounce(filters.search, 500);

  const { data: firstData, loading, fetchMore } = useQuery<UsersResponse>(GET_USERS, {
    variables: {
      search: debouncedText.trim(),
      page: filters.loadMore||1,
      count: filters.count,
    }
  });

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
        variables: { id: editId, name: formModal.name, email: formModal.email },
      });
      setEditId(null);
    } else {
      await createUser({
        variables: { name: formModal.name, email: formModal.email },
      });
    }
    setFormModal("");
  };

  const handleEdit = (u: any) => {
    setEditId(u.id);
    setFormModal({
      name: u.name,
      email: u.email
    });
  };

  const columns = [
    {
      name: 'Name',
      key: 'name',
      render: (item: any) => item.name
    },
    {
      name: 'Email',
      key: 'email',
      render: (item: any) => item.email
    },
    {
      name: 'Created At',
      key: 'createdAt',
      render: (item: any) => dateTimePipe(Number(item.createdAt))
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
      email: ''
    });
  }

  useEffect(() => {
    setFilter((prev: any) => ({ ...prev, page: 1, loadMore: 1 }));
  }, [debouncedText.trim()]);

  useEffect(() => {
    if (filters.page == 1) {
      setData(firstData?.users || []);
    }else{
      // setData((prev) => [...prev, ...(firstData?.users || [])]);
    }
    if (firstData?.users?.length == filters.count&&filters.page==1) {
      setFilter((prev: any) => ({ ...prev, page: 2 }));
    }
    if(firstData?.users?.length != filters.count && loading==false){
      setFilter((prev: any) => ({ ...prev, loadMore: null }));
    }
  }, [firstData]);

  useEffect(() => {
    if (!(filters?.loadMore != null && filters.loadMore == filters.page && filters.page != 1)) return;
    console.log('fetchMore filters', filters);
    fetchMore({ variables: { search: debouncedText.trim(), page: filters.page, count: filters.count } }).then((res: any) => {
      console.log('fetchMore', res);
      if (res?.data?.users?.length) {
        setData((prev) => [...prev, ...res.data.users]);
      }
      if (res?.data?.users?.length < filters.count) {
        setFilter((prev) => ({ ...prev, loadMore: null }));
      } else {
        setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
      }
    }).catch(err => {
      console.error('fetchMore error', err);
    });
  }, [filters?.loadMore]);

  const loadMore = () => {
    setFilter((prev) => ({ ...prev, loadMore: prev.loadMore ? prev.page : null }));
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-2">Manage your user records with search, filter, and action options</p>
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
                onChange={e => setFilter((prev: any) => ({ ...prev, search: e.target.value }))}
                id="searchInput"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="Search by name, email, or role..."

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
                Add New User
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
            data={data || []}
            total={data?.length || 0}
            // isLoading={loading}
            count={5}
            loadMore={filters.loadMore ? loadMore : undefined}
          />
        </div>

        <div id="emptyState" className="text-center py-12 hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <i className="fas fa-users text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No users found</h3>
          <p className="text-gray-600 max-w-md mx-auto">Try adjusting your search or filter to find what {`you're`} looking for.</p>
          <button id="resetFilters" className="mt-4 text-blue-500 hover:text-secondary font-medium">
            Reset all filters
          </button>
        </div>
      </div>

      {/* <h1>GraphQL CRUD</h1>

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
      /> */}
      {formModal ? <Modal
        onResult={e => setFormModal('')}
        title={editId ? 'Edit User' : 'Add New User'}
        body={<form
          onSubmit={e => { e.preventDefault(); handleSubmit() }}
          className="p-6 space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" id="userName"
              value={formModal.name}
              onChange={e => setFormModal((prev: any) => ({ ...prev, name: e.target.value }))}
              required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" id="userEmail"
              value={formModal.email}
              onChange={e => setFormModal((prev: any) => ({ ...prev, email: e.target.value }))}
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
