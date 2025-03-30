"use server";

import { auth } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const { userId } = await auth();
  // Return only what's needed in the client
  return { userId };
}

export async function checkUserPermission() {
  const { userId } = await auth();
  // Check permissions, role, etc.
  return { allowed: Boolean(userId) };
} 