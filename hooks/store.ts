/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

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
          user: {
            ...(get() as any).user,
            ...p,
          },
        }),

      setLoader: (p: boolean) =>
        set({
          loading: p,
        }),
    }),
    {
      name: 'app-storage', // key in localStorage
      partialize: (state:any) => ({
        user: state.user, // persist only user
      }),
    }
  )
)

export default function useZStore() {
  const store = useStore(useShallow(selector))
  return store
}