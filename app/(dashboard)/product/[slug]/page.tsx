// import { getProductBySlug } from "@/utils/actions/productDetails";
// import { notFound } from "next/navigation";
// import ProductDetails from "@/components/products/ProductDetails";

// export default async function ProductPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   try {
//     const product = await getProductBySlug(params.slug);

//     if (!product) {
//       return notFound();
//     }

//     return (
//       <div className="min-h-screen bg-background">
//         <ProductDetails product={product} />
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return notFound();
//   }
// }

export default async function ProductPage() {
  return <div>page</div>;
}
