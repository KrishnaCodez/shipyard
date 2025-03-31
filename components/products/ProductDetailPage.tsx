"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Calendar,
  Globe,
  Twitter,
  MessageSquare,
  ChevronUp,
  Share2,
  ArrowLeft,
  Bookmark,
  Heart,
  Users,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { upvoteProduct } from "@/utils/actions/productDetails";

interface ProductDetailPageProps {
  product: any;
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const router = useRouter();
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container max-w-5xl mx-auto px-4 pt-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background pt-20 pb-10">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
              {product.logo ? (
                <Image
                  src={product.logo}
                  alt={product.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {product.categories.map((category: any) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {product.headline}
              </p>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleUpvote}
                  disabled={isUpvoting || isUpvoted}
                  className={`gap-2 ${isUpvoted ? "bg-primary/90" : ""}`}
                >
                  <ChevronUp className="h-5 w-5" />
                  <span>Upvote</span>
                  <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {upvotes}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </Button>
                <Button variant="outline" size="lg" asChild className="gap-2">
                  <a
                    href={product.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Visit Website</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start mb-8 bg-transparent border-b">
            <TabsTrigger
              value="about"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-6 pb-3"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-6 pb-3"
            >
              Comments ({product.comments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <div className="prose max-w-none mb-8">
                  <p className="whitespace-pre-wrap">{product.description}</p>
                </div>

                <h2 className="text-2xl font-semibold mb-4">Screenshots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* Replace with actual screenshots or placeholders */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg"
                      alt="Screenshot"
                      width={600}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg"
                      alt="Screenshot"
                      width={600}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Creator</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={product.user?.image || ""}
                          alt={product.user?.firstName}
                        />
                        <AvatarFallback>
                          {product.user?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {product.user?.firstName} {product.user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{product.user?.username}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Follow Creator
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Released on {product.releaseDate}</span>
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
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold">{upvotes}</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <ChevronUp className="h-4 w-4" /> Upvotes
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold">
                          {product.comments?.length || 0}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" /> Comments
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-0">
            <div className="space-y-6">
              {product.comments.length > 0 ? (
                product.comments.map((comment: any) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.user?.image || ""}
                          alt={comment.user?.firstName}
                        />
                        <AvatarFallback>
                          {comment.user?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {comment.user?.firstName} {comment.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{comment.body}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
