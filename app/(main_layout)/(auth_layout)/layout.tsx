/* eslint-disable react-hooks/set-state-in-effect */
'use client'
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return <>
      {children}
    </>;

}
