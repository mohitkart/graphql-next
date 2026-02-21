/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { postApi } from '@/lib/apiClient'
import { useRouter } from 'next/navigation'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'

export const selector = (state: any) => ({
  user: state.user,
  loading: state.loading,
  setLoader: state.setLoader,
  setUser: state.setUser,
})

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,

      setUser: (p: any) =>
        set({
          user: p?{
            ...(get() as any).user,
            ...p,
          }:null,
        }),
      setLoader: (p: boolean) =>
        set({
          loading: p,
        }),
    }),
    {
      name: 'app-storage', // key in localStorage
      partialize: (state: any) => ({
        user: state.user, // persist only user
      }),
    }
  )
)

export default function useZStore() {
  const store = useStore(useShallow(selector))

  const router = useRouter()
  const logout = async () => {
    const res=await postApi({ url: '/api/logout', payload: {} });
    store.setUser(null)
    router.refresh(); // 🔄 Clears server component cache
    router.push("/login");
    return res
  }
  return {
    ...store, 
    logout
  }
}