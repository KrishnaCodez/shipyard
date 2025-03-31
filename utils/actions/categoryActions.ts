"use server";

import { prisma } from "@/lib/prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // If no categories exist, create default ones
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Development" },
        { name: "Design" },
        { name: "Marketing" },
        { name: "Business" },
        { name: "Personal" },
      ];

      await prisma.category.createMany({
        data: defaultCategories,
      });

      return {
        categories: await prisma.category.findMany({
          orderBy: {
            name: "asc",
          },
        })
      };
    }

    return { categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
}
