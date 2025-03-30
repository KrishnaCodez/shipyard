"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const products = new Map();
const categories = new Map();
const users = new Map();

// This is a mock function to simulate fetching products from a database
// In a real application, you would use Prisma to query your database
export async function getProducts() {
  // Try to get real products from the database
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        upvotes: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (products.length > 0) {
      return products;
    }
  } catch (error) {
    console.log("Error fetching products:", error);
  }

  // Fallback to mock data if no products or error occurred
  return [
    {
      id: "1",
      name: "Purgo Photo Cleaner",
      slug: "purgo-photo-cleaner",
      headline: "Cut your iCloud costs by cleaning up your gallery",
      rank: 21,
      description:
        "Purgo is an AI-powered photo cleaner that helps you identify and remove duplicate, blurry, and unwanted photos from your gallery. Save storage space and reduce your iCloud costs.",
      logo: "/placeholder.svg",
      releaseDate: "2023-05-15",
      website: "https://purgo.app",
      twitter: "purgoapp",
      discord: "purgo",
      status: "APPROVED",
      categories: [{ name: "Development" }],
      upvotes: [{ id: "1" }, { id: "2" }, { id: "3" }],
      user: {
        name: "John Doe",
        image: "/placeholder.svg",
      },
    },
    {
      id: "2",
      name: "getuserfeedback.com",
      slug: "getuserfeedback",
      headline:
        "Grow faster with user feedback: in-app onboarding, surveys, and embedded forms",
      rank: 20,
      description:
        "A complete user feedback platform that helps you collect, analyze, and act on user feedback. Includes in-app surveys, onboarding flows, and embedded feedback forms.",
      logo: "/placeholder.svg",
      releaseDate: "2023-06-20",
      website: "https://getuserfeedback.com",
      twitter: "getuserfeedback",
      discord: "getuserfeedback",
      status: "APPROVED",
      categories: [{ name: "Business" }],
      upvotes: [{ id: "1" }, { id: "2" }],
      user: {
        name: "Jane Smith",
        image: "/placeholder.svg",
      },
    },
    {
      id: "3",
      name: "Refiner",
      slug: "refiner",
      headline: "Customer feedback and survey platform for SaaS",
      rank: 18,
      description:
        "Refiner helps SaaS companies collect and analyze customer feedback through targeted in-app surveys. Improve your product based on real user insights.",
      logo: "/placeholder.svg",
      releaseDate: "2023-07-10",
      website: "https://refiner.io",
      twitter: "refinerapp",
      discord: "refiner",
      status: "APPROVED",
      categories: [{ name: "Business" }],
      upvotes: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
      user: {
        name: "Alex Johnson",
        image: "/placeholder.svg",
      },
    },
  ];
}

// Mock function to simulate upvoting a product
export async function upvoteProduct(productId: string) {
  // In a real app, you would use Prisma to update the database
  console.log(`Upvoted product: ${productId}`);

  // Revalidate the products page to show the updated upvote count
  revalidatePath("/");

  return { success: true };
}

// Function to get categories and ensure they exist
export async function getCategories() {
  try {
    // Check if categories exist
    const existingCategories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // If no categories exist, create default ones
    if (existingCategories.length === 0) {
      const defaultCategories = [
        { name: "Development" },
        { name: "Design" },
        { name: "Marketing" },
        { name: "Business" },
        { name: "Personal Life" },
        { name: "For Sale" },
      ];

      await prisma.category.createMany({
        data: defaultCategories,
        skipDuplicates: true,
      });

      // Get the newly created categories
      return await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
    }

    return existingCategories;
  } catch (error) {
    console.error("Error getting categories:", error);

    // Return some mock categories if database operation fails
    return [
      { id: "1", name: "Development" },
      { id: "2", name: "Design" },
      { id: "3", name: "Marketing" },
      { id: "4", name: "Business" },
      { id: "5", name: "Personal Life" },
      { id: "6", name: "For Sale" },
    ];
  }
}

// Mock function to get statistics
export async function getStatistics() {
  return {
    visits: 65346,
    pageViews: 248639,
  };
}

export async function getProductById(id: string) {
  // In a real app, you would use Prisma to query the database
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        upvotes: true,
        user: true,
      },
    });
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
}

// Get product by slug
export async function getProductBySlug(slug: string) {
  // In a real app, you would use Prisma to query the database
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: true,
        upvotes: true,
        user: true,
      },
    });
  } catch (error) {
    console.error("Error getting product by slug:", error);
    return null;
  }
}
