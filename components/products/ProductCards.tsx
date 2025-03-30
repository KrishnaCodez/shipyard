"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { upvoteProduct } from "@/utils/actions/productDetails";
import { toast } from "sonner";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [upvotes, setUpvotes] = useState(product.upvotes?.length || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpvoted) return;

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

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
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
              <Badge variant="default" className="text-xs">
                Pending
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {product.headline}
          </p>
        </div>

        <div
          className="flex flex-col items-center gap-1"
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
      </div>
    </Link>
  );
}
