"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";

export async function upvoteProduct(productId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, image: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has already upvoted
    const existingUpvote = await prisma.upvote.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });

    if (!existingUpvote) {
      // Only allow upvoting, no unvoting
      await prisma.upvote.create({
        data: {
          userId: user.id,
          productId,
        },
      });

      // Create notification for product owner
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { userId: true },
      });

      if (product) {
        await prisma.notification.create({
          data: {
            userId: product.userId,
            productId,
            type: "UPVOTE",
            body: "Someone upvoted your product!",
            status: "UNREAD",
            profilePicture: user.image || "",
          },
        });
      }
    }

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.log("Error upvoting product:", error);
    throw error;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        categories: true,
        upvotes: {
          select: {
            id: true,
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                image: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.log("Error fetching product:", error);
    throw error;
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: Status.APPROVED, // Only fetch approved products
      },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        categories: true,
        upvotes: {
          select: {
            id: true,
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            upvotes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.log("Error fetching products:", error);
    return [];
  }
}

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

      return await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
    }

    return categories;
  } catch (error) {
    console.log("Error fetching categories:", error);
    return [];
  }
}

export async function getStatistics() {
  try {
    const [totalProducts, totalUpvotes, totalComments] = await Promise.all([
      prisma.product.count({
        where: { status: Status.APPROVED },
      }),
      prisma.upvote.count(),
      prisma.comment.count(),
    ]);

    const topProducts = await prisma.product.findMany({
      where: { status: Status.APPROVED },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
      orderBy: {
        upvotes: {
          _count: "desc",
        },
      },
      take: 5,
    });

    const recentActivity = await prisma.product.findMany({
      where: { status: Status.APPROVED },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return {
      totalProducts,
      totalUpvotes,
      totalComments,
      topProducts,
      recentActivity,
    };
  } catch (error) {
    console.log("Error fetching statistics:", error);
    return {
      totalProducts: 0,
      totalUpvotes: 0,
      totalComments: 0,
      topProducts: [],
      recentActivity: [],
    };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
        categories: true,
        upvotes: {
          select: {
            id: true,
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                image: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.log("Error fetching product by ID:", error);
    throw error;
  }
}
