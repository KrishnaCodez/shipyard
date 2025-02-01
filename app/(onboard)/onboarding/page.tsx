import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { onboarded: true },
  });

  if (user?.onboarded || !user) {
    redirect("/member"); // or role-based redirect
  }

  return (
    <div>
      <h1>Hey... You got it.</h1>
    </div>
  );
}
