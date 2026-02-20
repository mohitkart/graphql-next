/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import useZStore from "@/hooks/store";
import Link from "next/link";
import Header from "../Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useZStore()

  if (user) {
    return (
      <div>
        <Header />
        {children}
      </div>
    );
  } else {
    return (<>
    <Header />
    <div className="p-4 text-center">
        You are not authorized to use this page. Please <Link href="/login" className="text-blue-500 underline">login</Link>
      </div>
    </>
      
    );
  }
}