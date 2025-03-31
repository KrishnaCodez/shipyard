import ProductForm from "@/components/products/AddProducts";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const { userId } = await auth();
  
  // Redirect if not logged in
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto">
      <ProductForm />
    </div>
  );
}
