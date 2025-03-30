import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc", // Order by name ascending
      },
    });

    // If no categories exist yet, create some default ones
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Development" },
        { name: "Design" },
        { name: "Marketing" },
        { name: "Business" },
        { name: "Personal Life" },
        { name: "For Sale" },
      ];

      // Create the default categories
      await prisma.category.createMany({
        data: defaultCategories,
        skipDuplicates: true,
      });

      // Fetch the newly created categories
      const newCategories = await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return NextResponse.json({ categories: newCategories });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
