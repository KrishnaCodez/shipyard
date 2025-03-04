"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { upvoteProduct } from "@/utils/actions/productDetails";
import ProductDrawer from "./ProductDrawer";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [upvotes, setUpvotes] = useState(product.upvotes.length);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (!isUpvoted) {
      setUpvotes(upvotes + 1);
      setIsUpvoted(true);
      await upvoteProduct(product.id);
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={product.logo || "/placeholder.svg"}
            alt={product.name}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{product.name}</h3>
            {product.status === "APPROVED" && (
              <Badge variant="default" className="text-xs">
                Deals
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {product.headline}
          </p>
        </div>
        <div
          className="flex flex-col items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            handleUpvote();
          }}
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

      <ProductDrawer product={product} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
