"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/components/StepIndicator";
import { SuccessAnimation } from "@/components/SuccessAnimation";

const steps = [
  {
    id: "step-1",
    name: "Personal Details",
    description: "Enter your basic information to get started.",
    fields: ["university", "department", "degreeLevel", "age", "phone", "bio"],
  },
  {
    id: "step-2",
    name: "Technical Profile",
    description: "Tell us about your skills and experience.",
    fields: ["primarySkills", "experienceLevel", "interests", "preferredRoles"],
  },
  {
    id: "step-3",
    name: "Project Preferences",
    description: "Choose your preferred collaboration settings.",
    fields: [
      "projectType",
      "weeklyAvailability",
      "teamSize",
      "collaborationMode",
    ],
  },
];

const formSchema = z.object({
  // Step 1
});

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [previousStep, setPreviousStep] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      primarySkills: [],
      interests: [],
      preferredRoles: [],
      projectType: [],
      collaborationMode: [],
    },
  });

  const processForm = async (data: z.infer<typeof formSchema>) => {
    setShowSuccess(true);
    // Redirect after animation completes
    setTimeout(() => {
      router.push("/product");
    }, 2000); // 2 seconds for animation
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < step) return "done";
    if (stepIndex === step) return "ongoing";
    return "pending";
  };

  const next = async () => {
    const fields = steps[step].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (step < steps.length - 1) {
      setPreviousStep(step);
      setStep(step + 1);
    }
  };

  const prev = () => {
    if (step > 0) {
      setPreviousStep(step);
      setStep(step - 1);
    }
  };

  if (showSuccess) {
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="rounded-lg border bg-white shadow-sm">
          <SuccessAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="grid md:grid-cols-[300px_1fr]">
          {/* Left sidebar */}
          <div className="border-r p-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
              <p className="text-sm text-muted-foreground">
                Make your profile complete by filling out all the necessary
                information. Please verify all details before proceeding.
              </p>
            </div>

            <div className="mt-8 space-y-2">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-start gap-3 rounded-md p-3 transition-colors",
                    step === i && "bg-muted"
                  )}
                >
                  <StepIndicator status={getStepStatus(i)} />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-medium">{steps[step].name}</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {step + 1}/{steps.length} completed
                </span>
                <Progress
                  value={((step + 1) / steps.length) * 100}
                  className="w-[100px]"
                />
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(processForm)}
                className="space-y-6 pt-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 0 && (
                      <div className="grid gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          {/* University */}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Degree Level */}

                          {/* Age */}
                        </div>

                        {/* Phone */}
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid gap-6">{/* Primary Skills */}</div>
                    )}
                    {step === 2 && (
                      <div className="grid gap-6">{/* Project Type */}</div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    onClick={prev}
                    variant="outline"
                    disabled={step === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={next}
                    disabled={step === steps.length - 1}
                    className="ml-auto"
                  >
                    Next Step
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  {step === steps.length - 1 && (
                    <Button type="submit">Complete</Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
