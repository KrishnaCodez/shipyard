"use client";

import Image from "next/image";
import { Calendar, Globe, MessageSquare, Twitter } from "lucide-react";
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

interface ProductDetailProps {
  product: any;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  if (!product) return null;

  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
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
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-xl text-muted-foreground">
                {product.headline}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {product.categories?.map((category: any, index: number) => (
                  <Badge key={index} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="aspect-video rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.name} screenshot ${index + 1}`}
                      width={600}
                      height={338}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center text-muted-foreground">
                  No screenshots available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Information about this product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Released on {formatDate(product.releaseDate)}</span>
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

              <Separator />

              <div className="pt-2">
                <Button asChild className="w-full">
                  <a
                    href={product.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maker</CardTitle>
              <CardDescription>The person behind this product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  {product.user?.image ? (
                    <Image
                      src={product.user.image || "/placeholder.svg"}
                      alt={product.user.username || "User"}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {product.user?.username?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {product.user?.username || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.user?.firstName} {product.user?.lastName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
