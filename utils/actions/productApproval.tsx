import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const products = new Map();
const categories = new Map();
const users = new Map();

export async function rejectProduct(id: string) {
  const { userId } = await auth();

  // In a real app, you would check if the user is an admin
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const product = products.get(id);

    if (!product) {
      return { error: "Product not found" };
    }

    product.status = "REJECTED";
    product.updatedAt = new Date();

    products.set(id, product);

    revalidatePath("/products");
    // revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Error rejecting product:", error);
    return { error: "Failed to reject product" };
  }
}

export async function approveProduct(id: string) {
  const { userId } = await auth();

  // In a real app, you would check if the user is an admin
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const product = products.get(id);

    if (!product) {
      return { error: "Product not found" };
    }

    product.status = "APPROVED";
    product.updatedAt = new Date();

    products.set(id, product);

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Error approving product:", error);
    return { error: "Failed to approve product" };
  }
}
