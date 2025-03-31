"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { approveProduct, rejectProduct } from "@/utils/actions/productApproval";

interface AdminProductCardProps {
  product: any;
}

export default function AdminProductCard({ product }: AdminProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(product.status);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const result = await approveProduct(product.id);
      if (result.success) {
        setStatus("APPROVED");
        toast.success("Product approved successfully");
      } else {
        throw new Error(result.error || "Failed to approve product");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const result = await rejectProduct(product.id);
      if (result.success) {
        setStatus("REJECTED");
        toast.success("Product rejected");
      } else {
        throw new Error(result.error || "Failed to reject product");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {product.headline}
            </p>

            <div className="text-sm mb-4">
              <span className="text-muted-foreground">Submitted by: </span>
              <span>
                {product.user?.firstName} {product.user?.lastName}
              </span>
              <span className="text-muted-foreground">
                {" "}
                ({product.user?.email})
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {product.categories.map((category: any) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <Badge
            variant={
              status === "PENDING"
                ? "outline"
                : status === "APPROVED"
                  ? "default"
                  : "destructive"
            }
          >
            {status}
          </Badge>
        </div>
      </CardContent>

      {status === "PENDING" && (
        <CardFooter className="border-t flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isLoading}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
