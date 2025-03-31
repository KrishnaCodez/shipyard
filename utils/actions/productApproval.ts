"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveProduct(productId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { status: "APPROVED" },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error approving product:", error);
    return { error: "Failed to approve product" };
  }
}

export async function rejectProduct(productId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting product:", error);
    return { error: "Failed to reject product" };
  }
}
