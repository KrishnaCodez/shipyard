"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  Calendar,
  Globe,
  MessageSquare,
  Twitter,
  ArrowUpRight,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { upvoteProduct } from "@/utils/actions/productDetails";

interface ProductDrawerProps {
  product: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ProductDrawer({
  product,
  isOpen,
  setIsOpen,
}: ProductDrawerProps) {
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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <DrawerHeader className="text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {product.logo ? (
                  <Image
                    src={product.logo || "/placeholder.svg"}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <DrawerTitle className="text-2xl">{product.name}</DrawerTitle>
                <DrawerDescription className="text-base">
                  {product.headline}
                </DrawerDescription>
              </div>
            </div>
            <Link
              href={`/products/${product.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowUpRight className="h-6 w-6" />
            </Link>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {product.categories.map((category: any) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Released on {product.releaseDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
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
                    <div className="flex items-center gap-2 text-sm">
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
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`https://discord.gg/${product.discord}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Discord
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Creator</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    {product.user?.image ? (
                      <Image
                        src={product.user.image}
                        alt={`${product.user.firstName || ""} ${product.user.lastName || ""}`}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {product.user?.firstName?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <span className="text-sm">
                    {product.user?.firstName} {product.user?.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-row justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUpvote}
              disabled={isUpvoting || isUpvoted}
              className={`gap-2 ${isUpvoted ? "text-orange-500" : ""}`}
            >
              <ChevronUp className="h-4 w-4" />
              <span>{upvotes}</span>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={product.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
