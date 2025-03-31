"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendNotificationEmail(
  email: string,
  subject: string,
  html: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: "urvish555mali@gmail.com",
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function approveProduct(productId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { status: "APPROVED" },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (product.user.email) {
      await sendNotificationEmail(
        product.user.email,
        "Your product has been approved!",
        `Congratulations! Your product "${product.name}" has been approved.`
      );
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Error approving product:", error);
    return { error: "Failed to approve product" };
  }
}

export async function rejectProduct(productId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { status: "REJECTED" },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (product.user.email) {
      await sendNotificationEmail(
        product.user.email,
        "Your product submission status",
        `Your product "${product.name}" has been reviewed but could not be approved at this time.`
      );
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Error rejecting product:", error);
    return { error: "Failed to reject product" };
  }
}
