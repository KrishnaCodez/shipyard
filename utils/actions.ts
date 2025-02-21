"use server";

import { prisma } from "@/lib/prisma";
import { checkRole } from "@/utils/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { DegreeLevel, ExperienceLevel } from "@prisma/client";
import { profile } from "console";
import { revalidatePath } from "next/cache";
import { calculateAge } from "./calcAge";
import { NextResponse } from "next/server";

export async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: null },
      }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}



export async function checkOnboarding() {
  const { userId } = await auth();
  if (!userId) return { onboarded: false };

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { onboarded: true },
  });

  return { isOnboarded: user?.onboarded || false };
}
