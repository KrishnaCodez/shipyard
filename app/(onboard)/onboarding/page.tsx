import { redirect } from "next/navigation";
import OnboardingForm from "@/components/auth/OnboardingForm";
import { auth } from "@clerk/nextjs/server";

export default async function OnboardingPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");

  const isOnboarded = (sessionClaims as ClerkUserMetadata)?.publicMetadata
    ?.onBoarded;

  if (isOnboarded) {
    redirect("/products");
  }

  return (
    <div>
      {/* <h1>Hey... You got it.</h1> */}
      {/* <FieldTest /> */}
      <OnboardingForm />
    </div>
  );
}
