import { Roles } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = () => {
  const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth();
    return sessionClaims?.metadata.role === role;
  };

  console.log(checkRole("admin"));

  return <div className="bg-zinc-900">page</div>;
};

export default page;
