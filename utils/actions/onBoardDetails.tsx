  "use server";

  import { prisma } from "@/lib/prisma";
  import { auth, clerkClient } from "@clerk/nextjs/server";
  import { DegreeLevel, ExperienceLevel } from "@prisma/client";
  import { revalidatePath } from "next/cache";

  const containsSpecialCharacters = (str: string) => {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    return specialChars.test(str);
  };

  const validateInput = (formData: FormData) => {
    const errors: string[] = [];

    // Username validation
    const username = formData.get("username")?.toString() || "";
    if (containsSpecialCharacters(username)) {
      errors.push("Username cannot contain special characters");
    }
    if (username.length < 3 || username.length > 15) {
      errors.push("Username must be between 3 and 15 characters");
    }

    // Bio validation
    const bio = formData.get("bio")?.toString() || "";
    if (bio.length > 200) {
      errors.push("Bio must be less than 200 characters");
    }

    const skills = formData.getAll("skills");
    if (skills.length < 3) {
      errors.push("Please select at least 3 skills");
    }

    const requiredFields = [
      "university",
      "department",
      "degreeLevel",
      "experience",
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        errors.push(`${field} is required`);
      }
    }

    const urlFields = ["github", "portfolio"];
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    for (const field of urlFields) {
      const url = formData.get(field)?.toString();
      if (url && !urlPattern.test(url)) {
        errors.push(`Invalid ${field} URL format`);
      }
    }

    const phone = formData.get("phone")?.toString() || "";
    if (phone && !/^[0-9+\-\s]+$/.test(phone)) {
      errors.push("Phone number can only contain numbers, +, -, and spaces");
    }

    return errors;
  };

  export async function onBoardDetails(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    if (!formData || typeof formData.get !== "function") {
      return { error: "Invalid form data" };
    }

    try {
      const validationErrors = validateInput(formData);
      if (validationErrors.length > 0) {
        return { error: validationErrors.join(", ") };
      }

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
              profilePicture: formData.get("profilePhoto")?.toString() || null,
            },
          },
          technicalProfile: {
            create: {
              primarySkills: formData.getAll("skills") as string[],
              experienceLevel: experienceLevel as ExperienceLevel,
              githubUrl: formData.get("github")?.toString() || null,
              portfolioUrl: formData.get("portfolio")?.toString() || null,
            },
          },
        },
        include: {
          personalDetails: true,
          technicalProfile: true,
        },
      });

      const clerk = await clerkClient();

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          onBoarded: true,
          role: "USER",
        },
        privateMetadata: {},
      });

      const user = await clerk.users.getUser(userId);
      console.log("Updated metadata:", user.publicMetadata);

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
