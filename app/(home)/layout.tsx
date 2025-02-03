import Navbar from "@/components/Navbar";
import React from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="">
        <Navbar />
      </div>
      <div className="border-b border-solid border-b-[#b7b7b7]"></div>
      {children}
    </>
  );
}
