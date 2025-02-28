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

export async function onBoardDetails(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  if (!formData || typeof formData.get !== "function") {
    return { error: "Invalid form data" };
  }

  // console.log("Form data received:", {
  //   username: formData.get("username"),
  //   skills: formData.getAll("skills"),
  //   experience: formData.get("experience"),
  //   birthday: formData.get("birthday"),
  //   profilePhoto: formData.get("profilePhoto"),
  // });

  try {
    const profilePhoto = formData.get("profilePhoto");
    const degreeLevel = (formData.get("degreeLevel") as string).toUpperCase();
    const experienceLevel = (
      formData.get("experience") as string
    ).toUpperCase();

    const userProfile = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        onboarded: true,
        username: formData.get("username") as string,
        bio: formData.get("bio") as string,
        dob: new Date(formData.get("birthday") as string),
        profilePictureURL: profilePhoto ? (profilePhoto as string) : "",
        personalDetails: {
          create: {
            university: formData.get("university") as string,
            department: formData.get("department") as string,
            degreeLevel: degreeLevel as DegreeLevel,
            phone: formData.get("phone") as string,
            bio: formData.get("bio") as string,
            profilePicture: formData.get("profilePhoto") as string,
          },
        },
        technicalProfile: {
          create: {
            primarySkills: formData.getAll("skills") as string[],
            experienceLevel: experienceLevel as ExperienceLevel,
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
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to save onboarding details" };
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
