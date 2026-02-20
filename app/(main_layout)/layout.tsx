/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { useLayoutEffect, useState } from "react";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const [hydrated, setHydrated] = useState(false)

useLayoutEffect(()=>{
  setHydrated(true)
},[])

if(!hydrated) return <></>

  return (
   <>
    {children}
   </>
  );
}
