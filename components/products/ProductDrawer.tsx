"use client";

import Image from "next/image";
import { Calendar, Globe, MessageSquare, Twitter } from "lucide-react";
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
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-h-[90vh] overflow-auto">
        <DrawerHeader className="text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={product.logo || "/placeholder.svg"}
                alt={product.name}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <DrawerTitle className="text-2xl">{product.name}</DrawerTitle>
              <DrawerDescription className="text-base">
                {product.headline}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {product.categories.map((category: any, index: number) => (
              <Badge key={index} variant="outline">
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
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Creator</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={product.user.image || "/placeholder.svg"}
                      alt={product.user.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm">{product.user.name}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="aspect-video rounded-lg overflow-hidden bg-muted"
              >
                <Image
                  src="/placeholder.svg?height=180&width=320"
                  alt={`${product.name} screenshot ${index}`}
                  width={320}
                  height={180}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter className="flex-row justify-between">
          <Button variant="outline" asChild>
            <a href={product.website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
