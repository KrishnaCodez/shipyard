import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MagicField } from "@/utils/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ArrayToZodResolver } from "@/lib/ArrayToZod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FieldTest from "@/components/FieldTest";
import OnboardingForm from "@/components/OnboardingForm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Loader } from "lucide-react";

export default async function OnboardingPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");
  const isOnboarded = (sessionClaims as ClerkUserMetadata)?.publicMetadata
    ?.onBoarded;

  if (isOnboarded) {
    redirect("/product");
  }

  return (
    <div>
      {/* <h1>Hey... You got it.</h1> */}
      {/* <FieldTest /> */}
      <OnboardingForm />
    </div>
  );
}
