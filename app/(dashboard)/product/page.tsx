import { checkOnboardingStatus } from "@/lib/auth";
import { SessionSync } from "@/components/SessionSync";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  Clock,
  InfoIcon,
  CloudLightningIcon as LightningBolt,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getCategories,
  getProducts,
  getStatistics,
} from "@/utils/actions/productDetails";
import ProductCard from "@/components/products/ProductCards";

export default async function Dashboard() {
  // const { isOnboarded, redirect } = await checkOnboardingStatus();
  const { userId, sessionClaims } = await auth();
  const products = await getProducts();
  const categories = await getCategories();
  const statistics = (await getStatistics()) || {
    totalProducts: 0,
    totalUpvotes: 0,
    totalComments: 0,
    topProducts: [],
    recentActivity: [],
  };
  // const user = await currentUser();
  // console.log("User Role:", sessionClaims?.role);
  // console.log("User Session Data:", sessionClaims);
  const onboardingStatus = (sessionClaims as any)?.publicMetadata?.onBoarded;

  // Default values for missing statistics
  const visits = 0;
  const pageViews = 0;

  // console.log("User Onboarding Status:", onboardingStatus);
  // console.log("Full Session Claims:", sessionClaims);

  // console.log("Clerk Session Data:", {
  //    sessionClaims as ClerkUserMetadata?.publicMetadata?.onboarded,
  //   // userId,
  //   // dbStatus: user?.onboarded,
  // });
  // if (!isOnboarded) {
  //   console.log("User is not onboarded, redirecting to", redirect);
  // }

  return (
    <>
      <div className="container py-6 px-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <LightningBolt className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl font-bold">
                A launch platform for your products.
              </h1>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search a product" className="pl-10 pr-16" />
              <div className="absolute right-3 top-3 text-xs text-muted-foreground">
                Ctrl K
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Daily launches</h2>

            <Tabs defaultValue="daily" className="mb-8">
              <TabsList className="bg-transparent p-0 h-auto mb-6">
                <TabsTrigger
                  value="daily"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:rounded-none px-4 py-2"
                >
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:rounded-none px-4 py-2"
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:rounded-none px-4 py-2"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:rounded-none px-4 py-2"
                >
                  Yearly
                </TabsTrigger>
              </TabsList>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">New launches in</h3>
                  <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-sm">
                    22 hours
                  </div>
                  <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-sm">
                    7 mins
                  </div>
                  <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-sm">
                    40 secs
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Archives
                </Button>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mb-6">
                <p className="text-amber-800">
                  Top 3 daily products win badges. Weekly, Monthly and Yearly
                  winners win badges and are featured in our newsletter.
                  <Button
                    variant="link"
                    className="p-0 h-auto text-amber-800 font-medium"
                  >
                    More details
                  </Button>
                </p>
              </div>

              <TabsContent value="daily" className="m-0">
                <div className="space-y-4 mt-4">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-40 border rounded-lg">
                      <p className="text-muted-foreground">
                        No products to show
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="weekly" className="m-0">
                <div className="flex items-center justify-center h-40 border rounded-lg">
                  <p className="text-muted-foreground">
                    No weekly products to show
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="monthly" className="m-0">
                <div className="flex items-center justify-center h-40 border rounded-lg">
                  <p className="text-muted-foreground">
                    No monthly products to show
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="m-0">
                <div className="flex items-center justify-center h-40 border rounded-lg">
                  <p className="text-muted-foreground">
                    No yearly products to show
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-medium">STATISTICS</h3>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {statistics.totalProducts.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {statistics.totalUpvotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Upvotes</div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">CATEGORIES</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    {category.name === "Development" && (
                      <div className="mb-2 text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m18 16 4-4-4-4" />
                          <path d="m6 8-4 4 4 4" />
                          <path d="m14.5 4-5 16" />
                        </svg>
                      </div>
                    )}
                    {category.name === "Design" && (
                      <div className="mb-2 text-purple-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="13.5" cy="6.5" r=".5" />
                          <circle cx="17.5" cy="10.5" r=".5" />
                          <circle cx="8.5" cy="7.5" r=".5" />
                          <circle cx="6.5" cy="12.5" r=".5" />
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                        </svg>
                      </div>
                    )}
                    {category.name === "Marketing" && (
                      <div className="mb-2 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 3v18h18" />
                          <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                      </div>
                    )}
                    {category.name === "Business" && (
                      <div className="mb-2 text-blue-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="20"
                            height="14"
                            x="2"
                            y="7"
                            rx="2"
                            ry="2"
                          />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                    )}
                    {category.name === "Personal Life" && (
                      <div className="mb-2 text-indigo-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </div>
                    )}
                    {category.name === "For Sale" && (
                      <div className="mb-2 text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">OUR SPONSORS</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-black rounded-md p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                      </svg>
                    </div>
                    <div className="font-medium">Comp AI</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Open Source Compliance. Get SOC 2, ISO 27001 and GDPR
                    compliant in weeks, not months.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-900 rounded-md p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.29 7 12 12 20.71 7" />
                        <line x1="12" x2="12" y1="22" y2="12" />
                      </svg>
                    </div>
                    <div className="font-medium">Intercom for Startups</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Startups receive a 90% discount on Intercom's AI-powered
                    first customer service platform
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">YOU'RE ON A</h3>
                <div className="font-bold">1 DAY STREAK</div>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
