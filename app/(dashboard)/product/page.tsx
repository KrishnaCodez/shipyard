import { checkOnboardingStatus } from "@/lib/auth";
import { SessionSync } from "@/components/SessionSync";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  // const { isOnboarded, redirect } = await checkOnboardingStatus();
  const { userId, sessionClaims } = await auth();

  // const user = await currentUser();
  // console.log("User Role:", sessionClaims?.role);
  // console.log("User Session Data:", sessionClaims);
  const onboardingStatus = (sessionClaims as ClerkUserMetadata)?.publicMetadata
    ?.onBoarded;

  console.log("User Onboarding Status:", onboardingStatus);
  console.log("Full Session Claims:", sessionClaims);

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
      <SessionSync />
      {/* <p>User: {user?.username}</p> */}
      {/* <p>Role: {sessionClaims?.role || "No role assigned"}</p> */}

      <div>Protected Dashboard Content</div>
    </>
  );
}
