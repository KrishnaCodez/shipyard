"use server";

import { revalidatePath } from "next/cache";

// This is a mock function to simulate fetching products from a database
// In a real application, you would use Prisma to query your database
export async function getProducts() {
  // Simulate a database query
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

// Mock function to get categories
export async function getCategories() {
  return [
    { id: "1", name: "Development" },
    { id: "2", name: "Design" },
    { id: "3", name: "Marketing" },
    { id: "4", name: "Business" },
    { id: "5", name: "Personal Life" },
    { id: "6", name: "For Sale" },
  ];
}

// Mock function to get statistics
export async function getStatistics() {
  return {
    visits: 65346,
    pageViews: 248639,
  };
}
