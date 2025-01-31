import { checkOnboardingStatus } from "@/lib/auth";
import { SessionSync } from "@/components/SessionSync";

export default async function Dashboard() {
  const { isOnboarded, redirect } = await checkOnboardingStatus();

  if (!isOnboarded) {
    console.log("User is not onboarded, redirecting to", redirect);
  }

  return (
    <>
      <SessionSync />
      <div>Protected Dashboard Content</div>
    </>
  );
}
