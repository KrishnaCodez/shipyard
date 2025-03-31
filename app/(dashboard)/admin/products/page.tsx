import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminProductCard from "@/components/products/AdminProductCard";

export default async function AdminProductsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  const pendingProducts = await prisma.product.findMany({
    where: { status: "PENDING" },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      categories: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Product Approval Queue</h1>
      <div className="space-y-4">
        {pendingProducts.length > 0 ? (
          pendingProducts.map((product) => (
            <AdminProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No products pending approval
          </div>
        )}
      </div>
    </div>
  );
}
