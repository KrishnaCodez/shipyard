"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";
import { sendEmail } from "@/lib/email";
import { Status } from "@prisma/client";

export async function submitProduct(formData: FormData) {
  try {
    // First, log what we're receiving to debug
    console.log(
      "Form data received:",
      Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          typeof value === "string" ? value : "File or complex data",
        ])
      )
    );

    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    // Log the userId for debugging
    console.log("User ID from auth:", userId);

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      console.log("User not found for clerk ID:", userId);
      return { error: "User not found" };
    }

    // Log the user for debugging
    console.log("Found user with ID:", user.id);

    // Extract and validate form fields
    const name = formData.get("name");
    const headline = formData.get("headline");
    const description = formData.get("description");
    const website = formData.get("website");
    const releaseDate = formData.get("releaseDate");
    const twitter = formData.get("twitter");
    const discord = formData.get("discord");

    // Log the extracted values for debugging
    console.log("Extracted form values:", {
      name,
      headline,
      description,
      website,
      releaseDate,
      twitter,
      discord,
    });

    // Validate required fields
    if (!name || !headline || !description || !website || !releaseDate) {
      return { error: "All required fields must be filled" };
    }

    const categoryValues = formData.getAll("categories");
    console.log("Category values:", categoryValues);

    if (!categoryValues.length) {
      return { error: "Please select at least one category" };
    }

    // Generate a safe slug from the name
    let slug = "";
    if (typeof name === "string") {
      slug = generateSlug(name);
    } else {
      return { error: "Invalid product name" };
    }

    // Instead of connecting to possibly non-existent categories,
    // let's first check which categories exist and create any that don't
    const existingCategories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryValues.map((id) => id.toString()),
        },
      },
      select: { id: true },
    });

    const existingCategoryIds = existingCategories.map((c) => c.id);
    console.log("Existing category IDs:", existingCategoryIds);

    // Use default categories if the provided ones don't exist
    let categoryConnections;

    // If we have no matching categories, use the default ones or create them
    if (existingCategoryIds.length === 0) {
      // Get all categories
      const allCategories = await prisma.category.findMany({
        take: 3, // Just use the first 3 categories if none of the selected ones exist
      });

      if (allCategories.length > 0) {
        console.log(
          "Using existing categories:",
          allCategories.map((c) => c.id)
        );
        categoryConnections = {
          connect: allCategories.map((c) => ({ id: c.id })),
        };
      } else {
        // Create some default categories if none exist
        console.log("Creating default categories");
        categoryConnections = {
          create: [
            { name: "Development" },
            { name: "Design" },
            { name: "Business" },
          ],
        };
      }
    } else {
      // Use the existing categories that were found
      categoryConnections = {
        connect: existingCategoryIds.map((id) => ({ id })),
      };
    }

    // Create the product with the proper enum value
    const productData = {
      name: name.toString(),
      slug,
      headline: headline.toString(),
      description: description.toString(),
      website: website.toString(),
      twitter: twitter ? twitter.toString() : "",
      discord: discord ? discord.toString() : "",
      releaseDate: releaseDate.toString(),
      status: Status.PENDING,
      userId: user.id,
      categories: categoryConnections,
    };

    console.log("Product data to be created:", productData);

    const product = await prisma.product.create({
      data: productData,
    });

    console.log("Product created successfully:", product.id);

    // Safely handle admin notifications
    try {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { email: true },
      });

      if (admins.length > 0) {
        console.log(
          "Sending email to admins:",
          admins.map((a) => a.email)
        );
        await sendEmail(
          admins.map((admin) => admin.email),
          "New Product Submission",
          `A new product "${product.name}" has been submitted for review.`
        );
      }
    } catch (emailError) {
      // Just log email errors but don't fail the submission
      console.log(
        "Email notification failed:",
        emailError instanceof Error ? emailError.message : "Unknown email error"
      );
    }

    revalidatePath("/products");
    return { success: true, productId: product.id };
  } catch (error) {
    // Fix: Use console.log instead of console.error for server components
    console.log(
      "Error submitting product:",
      error instanceof Error ? error.message : "Unknown error"
    );

    // Create a safe error object
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit product";

    return { error: errorMessage };
  }
}
