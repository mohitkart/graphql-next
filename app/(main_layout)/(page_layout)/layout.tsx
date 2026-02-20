/* eslint-disable react-hooks/set-state-in-effect */
import Header from "../Header";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>
    <Header />
    {children}
  </div>
}