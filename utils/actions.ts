"use server";

import { prisma } from "@/lib/prisma";
import { checkRole } from "@/utils/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { DegreeLevel, ExperienceLevel } from "@prisma/client";
import { profile } from "console";
import { revalidatePath } from "next/cache";

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

export async function onBoardDetails(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const userProfile = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        onboarded: true,
        personalDetails: {
          create: {
            university: formData.get("university") as string,
            department: formData.get("department") as string,
            degreeLevel: formData.get("degreeLevel") as DegreeLevel,
            age: calculateAge(new Date(formData.get("birthday") as string)),
            phone: formData.get("phone") as string,
            bio: formData.get("bio") as string,
            profilePicture: formData.get("profilePhoto") as string,
          },
        },
        technicalProfile: {
          create: {
            primarySkills: formData.getAll("skills") as string[],
            experienceLevel: formData.get("experience") as ExperienceLevel,
            githubUrl: formData.get("github") as string,
            portfolioUrl: formData.get("portfolio") as string,
          },
        },
      },
      include: {
        personalDetails: true,
        technicalProfile: true,
      },
    });

    revalidatePath("/");
    return { success: true, data: userProfile };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Failed to save onboarding details" };
  }
}
