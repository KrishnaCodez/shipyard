import { getProductById } from "@/utils/actions/productDetails";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/products/ProductDetailPage";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { id } = params;
    const product = await getProductById(id);

    if (!product) {
      return notFound();
    }

    return <ProductDetailPage product={product} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
}
