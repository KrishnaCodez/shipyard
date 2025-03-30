import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/products/AddProducts";

export default async function NewProductPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { onboarded: true },
  });

  if (!user?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto py-8">
      <ProductForm />
    </div>
  );
}
