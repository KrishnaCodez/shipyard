"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { checkRole } from "@/utils/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { DegreeLevel, ExperienceLevel } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const onboardingSchema = z.object({
  university: z.string().min(2, "Please select a university"),
  department: z.string().min(2, "Please select a department"),
  degreeLevel: z.string().min(2, "Please select a degree level"),
  birthday: z.string().transform((str) => new Date(str)),
  phone: z.string().min(10).optional(),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  experience: z.string().min(3),
  github: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  username: z.string().min(3),
  bio: z.string().min(10).max(200).optional(),
  profilePhoto: z.string().optional(),
});

export async function onBoardDetails(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    // Convert FormData to object for validation
    const formDataObj = {
      university: formData.get("university"),
      department: formData.get("department"),
      degreeLevel: formData.get("degreeLevel"),
      birthday: formData.get("birthday"),
      phone: formData.get("phone"),
      skills: formData.getAll("skills"),
      experience: formData.get("experience"),
      github: formData.get("github"),
      portfolio: formData.get("portfolio"),
      username: formData.get("username"),
      bio: formData.get("bio"),
      profilePhoto: formData.get("profilePhoto"),
    };

    // Validate the data
    const validatedData = onboardingSchema.parse(formDataObj);

    const userProfile = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        onboarded: true,
        username: validatedData.username,
        bio: validatedData.bio ?? "",
        dob: validatedData.birthday,
        profilePictureURL: validatedData.profilePhoto ?? "",
        personalDetails: {
          create: {
            university: validatedData.university,
            department: validatedData.department,
            degreeLevel: validatedData.degreeLevel as DegreeLevel,
            phone: validatedData.phone ?? "",
            bio: validatedData.bio ?? "",
            profilePicture: validatedData.profilePhoto ?? "",
          },
        },
        technicalProfile: {
          create: {
            primarySkills: validatedData.skills,
            experienceLevel: validatedData.experience as ExperienceLevel,
            githubUrl: validatedData.github ?? "",
            portfolioUrl: validatedData.portfolio ?? "",
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
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => `${e.path}: ${e.message}`).join(", "),
      };
    }
    return { error: "Failed to save onboarding details" };
  }
}
