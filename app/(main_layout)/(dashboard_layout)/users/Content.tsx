/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import MKTable from "@/components/MkTable";
import { dateTimePipe } from "@/lib/shared";
import Modal from "@/components/Modal";
import { deleteApi, getApi, postApi, putApi } from "@/lib/apiClient";
import DebounceInput from "@/components/DebounceInput";
import swal from "@/components/Swal";

export default function Content() {
  const [editId, setEditId] = useState<string | null>(null);
  const [formModal, setFormModal] = useState<any>();
  const [data, setData] = useState<any[]>([]);
  const [formLoading, setFormLoading] = useState<any>(false);
  const [loading, setLoading] = useState<any>(true);
  const apiRef = useRef<any>(null)
  const [filters, setFilter] = useState<{ search: string, page: number, count: number, loadMore: any }>({ search: '', page: 1, count: 10, loadMore: false });

  const clearFilter = () => {
    getList({ page: 1 })
    setFilter(prev => ({ ...prev, page: 1 }));
  }

  const handleSubmit = async () => {
    setFormLoading(true)
    let res: any = null
    if (editId) {
      res = await putApi({ url: '/api/users', payload: { id: editId, name: formModal.name, email: formModal.email } })
    } else {
      res = await postApi({ url: '/api/users', payload: { name: formModal.name, email: formModal.email, password: formModal.password } })
    }
    setFormLoading(false)
    if (res.success) {
      setEditId(null);
      clearFilter()
      setFormModal(null);
    }
  };

  const handleEdit = (u: any) => {
    setEditId(u._id);
    setFormModal({
      name: u.name,
      email: u.email
    });
  };

  const deleteUser = (id: string) => {
    swal({ title: `Do you want to delete "${data?.find(itm=>itm._id==id)?.name}"`, showCancel: true,icon:'warning' }).then(res => {
      if (res.isConfirmed) {
        deleteApi({ url: `api/users/${id}` }).then(res => {
          if (res.success) {
            clearFilter()
          }
        })
      }
    })
  }

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
      render: (item: any) => dateTimePipe(item.createdAt)
    },
    {
      name: 'Actions',
      key: 'actions',
      render: (item: any) => <>
        <button onClick={() => handleEdit(item)} className="mr-2 text-blue-500 cursor-pointer">Edit</button>
        <button onClick={() => deleteUser(item._id)} className="text-red-500 cursor-pointer">Delete</button>
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


  const getList = (p = {}) => {
    const f = {
      page: filters.page,
      count: filters.count,
      search: filters.search,
      ...p
    }
    if (apiRef.current) apiRef.current?.abort();

    setLoading(true)
    getApi({ url: '/api/users', params: f, controllerRef: apiRef }).then((res: any) => {
      setLoading(false)
      if (res.success) {
        const data = res.data
        if (f.page == 1) {
          setData(prev => ([...data]))
        } else {
          setData(prev => ([...prev, ...data]))
        }
        const loadMore = (data.length > f.count)
        setFilter((prev) => ({ ...prev, loadMore: loadMore }));
      }
    })
  }


  useEffect(() => {
    getList()
  }, [filters.count, filters.page, filters.search]);

  const loadMore = () => {
    setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
  }

  useEffect(() => {
    return () => {
      if (apiRef.current) apiRef.current?.abort()
    }
  }, [])

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
              <DebounceInput
                type="text"
                value={filters.search}
                id="searchInput"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="Search by name, email, or role..."
                onChange={e => {
                  setFilter((prev: any) => ({ ...prev, search: e, page: 1 }))
                }}
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
            data={(data || [])}
            total={data?.length || 0}
            isLoading={loading}
            count={filters.count}
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
          {!editId ? <>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="text"
                value={formModal.password}
                onChange={e => setFormModal((prev: any) => ({ ...prev, password: e.target.value }))}
                required minLength={8} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" />
            </div>
          </> : <></>}
          <div className="flex justify-end space-x-3">
            <button type="button" className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => setFormModal('')}
            >Cancel</button>
            <button
              disabled={formLoading}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >{formLoading ? "Saving..." : "Save"}</button>
          </div>
        </form>}
      /> : null}
    </div>
  );
}
