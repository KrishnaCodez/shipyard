import {
  auth,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import prisma from "@prisma/client/edge";
// import { Role } from "@prisma/client/edge";

// const publicRoute = ["/", "/sign-in", "/sign-up", "/products"];
const isProtectedRoute = createRouteMatcher([
  "/dashboard", // Add any additional routes here
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect specified routes
  if (isProtectedRoute(req)) await auth.protect();

  // Get user ID from auth state
  // const userId = (await auth()).userId;
  // const pathname = req.nextUrl.pathname;

  // // Redirect unauthenticated users trying to access protected routes
  // if (!userId && isProtectedRoute(req)) {
  //   return (await auth()).redirectToSignIn();
  // }

  // if (userId) {
  //   // Check onboarding status
  //   const user = await prisma.user.findUnique({
  //     where: { clerkId: userId },
  //     select: { onboarded: true, role: true },
  //   });

  //   // Redirect to onboarding if not completed
  //   if (!user?.onboarded && !pathname.startsWith("/onboarding")) {
  //     return NextResponse.redirect(new URL("/onboarding", req.url));
  //   }

  //   // Prevent access to onboarding if already completed
  //   if (user?.onboarded && pathname.startsWith("/onboarding")) {
  //     return NextResponse.redirect(
  //       new URL(user.role === "ADMIN" ? "/admin" : "/member", req.url)
  //     );
  //   }

  //   // Role-based redirection
  //   if (user?.onboarded && pathname === "/") {
  //     return NextResponse.redirect(
  //       new URL(user.role === "ADMIN" ? "/admin" : "/member", req.url)
  //     );
  //   }
  // }

  // return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
