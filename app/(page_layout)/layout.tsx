/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { useEffect, useLayoutEffect, useState } from "react";
import Header from "./Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const [hydrated, setHydrated] = useState(false)

useEffect(() => {

}, [])

useLayoutEffect(()=>{
  setHydrated(true)
},[])

if(!hydrated) return <></>

  return (
   <div>
    <Header/>
    {children}
   </div>
  );
}
