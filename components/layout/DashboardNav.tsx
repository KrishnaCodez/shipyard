"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CloudLightningIcon as LightningBolt,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500">
              <LightningBolt className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold">UNEED</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium ${
                pathname === "/pricing"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Pricing
            </Link>
            <Link
              href="/add-product"
              className={`text-sm font-medium ${
                pathname === "/add-product"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Add your product
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto">
                  <span className="text-sm font-medium text-muted-foreground">
                    Products
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link href="/products">All Products</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/products/featured">Featured</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto">
                  <span className="text-sm font-medium text-muted-foreground">
                    Community
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link href="/community/forum">Forum</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/community/events">Events</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto">
                  <span className="text-sm font-medium text-muted-foreground">
                    More
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="mr-2"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-5 w-5" />
          </Button>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="User"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
