import { auth } from "@clerk/nextjs/server";
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

export default function OnboardingPage() {
  // const { userId } = await auth();

  // if (!userId) redirect("/sign-in");

  // const user = await prisma.user.findUnique({
  //   where: { clerkId: userId },
  //   select: { onboarded: true },
  // });

  // if (user?.onboarded || !user) {
  //   redirect("/member"); // or wq
  // }

  return (
    <div>
      {/* <h1>Hey... You got it.</h1> */}
      {/* <FieldTest /> */}
      <OnboardingForm />
    </div>
  );
}
