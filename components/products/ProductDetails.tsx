"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  Calendar,
  Globe,
  MessageSquare,
  Twitter,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { upvoteProduct } from "@/utils/actions/productDetails";

interface ProductDetailsProps {
  product: any;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { userId } = useAuth();
  const [upvotes, setUpvotes] = useState(product.upvotes?.length || 0);
  const [isUpvoted, setIsUpvoted] = useState(
    product.upvotes?.some((upvote: any) => upvote.userId === userId) || false
  );
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async () => {
    if (!userId) {
      toast.error("Please sign in to upvote");
      return;
    }

    if (isUpvoted) {
      toast.info("You've already upvoted this product");
      return;
    }

    setIsUpvoting(true);
    try {
      setUpvotes(upvotes + 1);
      setIsUpvoted(true);

      await upvoteProduct(product.id);
      toast.success("Product upvoted!");
    } catch (error) {
      // Revert optimistic update
      setUpvotes(upvotes);
      setIsUpvoted(false);
      toast.error("Failed to upvote product");
    } finally {
      setIsUpvoting(false);
    }
  };

  if (!product) return null;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {product.logo ? (
            <Image
              src={product.logo || "/placeholder.svg"}
              alt={product.name}
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
              {product.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-muted-foreground mb-4">
            {product.headline}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.categories.map((category: any) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleUpvote}
          disabled={isUpvoting || isUpvoted}
          className={`gap-2 ${isUpvoted ? "text-orange-500" : ""}`}
        >
          <ChevronUp className="h-4 w-4" />
          <span>{upvotes}</span>
        </Button>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={product.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {product.website}
                </a>
              </div>
              {product.twitter && (
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://twitter.com/${product.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @{product.twitter}
                  </a>
                </div>
              )}
              {product.discord && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://discord.gg/${product.discord}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Discord Server
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Released on {formatDate(product.releaseDate)}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Creator</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {product.user?.image ? (
                  <Image
                    src={product.user.image}
                    alt={`${product.user.firstName || ""} ${product.user.lastName || ""}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {product.user?.firstName?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {product.user?.firstName} {product.user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{product.user?.username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
