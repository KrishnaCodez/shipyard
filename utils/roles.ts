import { auth } from "@clerk/nextjs/server";
import { Roles } from "./types";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};
