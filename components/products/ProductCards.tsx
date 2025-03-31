"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { upvoteProduct } from "@/utils/actions/productDetails";
import { toast } from "sonner";
import ProductDrawer from "./ProductDrawer";
import { useAuth } from "@clerk/nextjs";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { userId } = useAuth();
  const [upvotes, setUpvotes] = useState(product.upvotes?.length || 0);
  const [isUpvoted, setIsUpvoted] = useState(
    product.upvotes?.some((upvote: any) => upvote.userId === userId) || false
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("Please sign in to upvote");
      return;
    }

    if (isUpvoted) {
      toast.info("You've already upvoted this product");
      return;
    }

    try {
      setUpvotes(upvotes + 1);
      setIsUpvoted(true);

      const response = await upvoteProduct(product.id);

      if (!response.success) {
        // Revert optimistic update
        setUpvotes(upvotes);
        setIsUpvoted(false);
        throw new Error("Failed to upvote product");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upvote");
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent if clicking on the upvote button or the link
    if (
      (e.target as HTMLElement).closest(".upvote-button") ||
      (e.target as HTMLElement).closest(".product-link")
    ) {
      return;
    }
    e.preventDefault();
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div
        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {product.logo ? (
            <Image
              src={product.logo || "/placeholder.svg"}
              alt={product.name}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              {product.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{product.name}</h3>
            {product.status === "APPROVED" && (
              <Badge variant="default" className="text-xs">
                Approved
              </Badge>
            )}
            {product.status === "PENDING" && (
              <Badge variant="outline" className="text-xs">
                Pending
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {product.headline}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex flex-col items-center gap-1 upvote-button"
            onClick={handleUpvote}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-8 w-8 rounded-full ${
                isUpvoted ? "text-orange-500" : ""
              }`}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">{upvotes}</span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="product-link p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <ProductDrawer
        product={product}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />
    </>
  );
}
