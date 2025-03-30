"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { approveProduct, rejectProduct } from "@/utils/actions/productApproval";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface AdminProductCardProps {
  product: any;
}

export default function AdminProductCard({ product }: AdminProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(product.status);

  const handleApprove = async () => {
    setIsLoading(true);

    try {
      const response = await approveProduct(product.id);

      if (response.error) {
        throw new Error(response.error);
      }

      setStatus("APPROVED");
      toast.success("Product approved successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve product"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);

    try {
      const response = await rejectProduct(product.id);

      if (response.error) {
        throw new Error(response.error);
      }

      setStatus("REJECTED");
      toast.success("Product rejected");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject product"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {product.logo ? (
                  <Image
                    src={product.logo || "/placeholder.svg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  {product.headline}
                </CardDescription>
              </div>
            </div>

            {/* <Badge variant={status === "APPROVED" ? "success" : status === "REJECTED" ? "destructive" : "pending"}> */}
            <Badge>{status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="text-sm text-muted-foreground">
            <p>Submitted on {formatDate(product.createdAt)}</p>
            <p className="mt-1">By {product.user?.username || "Anonymous"}</p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            View Details
          </Button>

          {status === "PENDING" && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500"
                onClick={handleReject}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-green-500"
                onClick={handleApprove}
                disabled={isLoading}
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>{product.headline}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Website</h3>
                <a
                  href={product.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {product.website}
                </a>
              </div>

              <div>
                <h3 className="font-medium mb-2">Release Date</h3>
                <p className="text-sm">{formatDate(product.releaseDate)}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Twitter</h3>
                <p className="text-sm">@{product.twitter}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Discord</h3>
                <p className="text-sm">{product.discord}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {product.categories?.map((category: any, index: number) => (
                  <Badge key={index} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image: any, index: number) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden bg-muted"
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`${product.name} screenshot ${index + 1}`}
                        width={400}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center text-muted-foreground">
                    No images available
                  </div>
                )}
              </div>
            </div>
          </div>

          {status === "PENDING" && (
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isLoading}
              >
                Reject
              </Button>
              <Button onClick={handleApprove} disabled={isLoading}>
                Approve
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
