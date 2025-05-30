import { prisma } from "./prisma";
import { Role } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function checkOnboardingStatus() {
  const { userId } = await auth();

  if (!userId) {
    return {
      isOnboarded: false,
      redirect: "/sign-in",
    };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { onboarded: true, role: true },
  });

  if (!user?.onboarded) {
    return {
      isOnboarded: false,
      redirect: "/onboard",
    };
  }

  return {
    isOnboarded: true,
    redirect: user.role === Role.ADMIN ? "/admin" : "/member",
  };
}
