"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtSign, ChevronLeft, ChevronRight, Info, X } from "lucide-react";
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
import SelectCommand from "./custom/select-command";
import { MagicField } from "@/utils/types";
import CustomDatePicker from "./custom/date-picker";
import PhoneNumberInput from "./custom/phone-input";
import CustomTextArea from "./custom/textarea";
import { CustomMultiSelect } from "./custom/multiselect";
import CustomSelect from "./custom/select";
import CustomInput from "./custom/input";

const steps = [
  {
    id: "step-1",
    name: "Personal Details",
    // description: "Enter your basic information to get started.",
    fields: ["university", "department", "degreeLevel", "age", "phone", "bio"],
  },
  {
    id: "step-2",
    name: "Technical Profile",
    // description: "Tell us about your skills and experience.",
    fields: ["primarySkills", "experienceLevel", "interests", "preferredRoles"],
  },
  {
    id: "step-3",
    name: "Setup Profile",
    // description: "Choose your preferred collaboration settings.",
    fields: [
      "projectType",
      "weeklyAvailability",
      "teamSize",
      "collaborationMode",
    ],
  },
];

const personalDetails: MagicField[] = [
  {
    type: "select",
    RenderComponent: SelectCommand,
    config: {
      name: "university",
      label: "College/University",
      className: "w-full grid grod-rows-2",
      placeholder: "Select your university",
      validation: z.string().min(2, "Please select a university"),
      options: () => [
        { label: "Charusat University", value: "Charusat University" },
        { label: "Ganpat University", value: "Ganpat University" },
        { label: "LJ University", value: "LJ University" },
      ],
    },
  },
  {
    type: "select",
    RenderComponent: SelectCommand,
    config: {
      name: "department",
      label: "Department",
      className: "w-full grid grod-rows-2",
      placeholder: "Select your department",
      validation: z.string().min(2, "Please select a department"),
      options: () => [
        { label: "Charusat University", value: "next" },
        { label: "Ganpat University", value: "react" },
        { label: "LJ University", value: "vue" },
      ],
    },
  },

  {
    type: "select",
    RenderComponent: SelectCommand,
    config: {
      name: "degreeLevel",
      label: "Degree Level",
      className: "w-full grid grod-rows-2",
      placeholder: "Select your Degree level",
      validation: z.string().min(2, "Please select a degreeLevel"),
      options: () => [
        { label: "Charusat University", value: "next" },
        { label: "Ganpat University", value: "react" },
        { label: "LJ University", value: "vue" },
      ],
    },
  },
  {
    type: "input",
    RenderComponent: CustomDatePicker,
    config: {
      type: "input",
      name: "birthday",
      label: "Birthday",
      placeholder: "Select your birthday",
      validation: z.string().min(2, "First name must be at least 2 characters"),
      defaultValue: "",
    },
  },

  {
    type: "input",
    RenderComponent: PhoneNumberInput,
    config: {
      type: "phone",
      name: "phone",
      label: "Phone (Optional)",
      className: "col-span-full",
      placeholder: "+1 (555) 000-0000",
      validation: z.string().min(10, "Number must be at least 10 characters"),
      defaultValue: "",
    },
  },
];

const technicalProfile: MagicField[] = [
  {
    type: "multiselect",
    RenderComponent: CustomMultiSelect,
    config: {
      name: "skills",
      label: "Technical Skills",
      placeholder: "Select skills...",
      validation: z.array(z.string()).min(1, "Select at least two skill"),
      className: "w-full",
      // Provide your options as an async function:
      options: async () => [
        { value: "react", label: "React" },
        { value: "typescript", label: "TypeScript" },
        { value: "node", label: "Node.js" },
        { value: "graphql", label: "GraphQL" },
        { value: "next", label: "Next.js" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
        { value: "angular", label: "Angular" },
        { value: "tailwind", label: "Tailwind CSS" },
        { value: "bootstrap", label: "Bootstrap" },
        { value: "chakra", label: "Chakra UI" },
        { value: "material", label: "Material UI" },
        { value: "ant", label: "Ant Design" },
      ],
      // Optionally provide conditional options:
      conditionalOptions: {
        fieldName: "role",
        fn: async (role: string) => {
          if (role === "frontend") {
            return [
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
            ];
          }
          return [];
        },
      },
      // (If your form provides the value of the "role" field, pass it as conditionalValue)
    },
  },
  {
    type: "select",
    RenderComponent: CustomSelect,
    config: {
      name: "experience",
      label: "Experience Level",
      className: "",
      placeholder: "Select your experience level",
      validation: z.string().min(3, "Please select a experience level"),
      options: () => [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
      ],
    },
  },

  {
    type: "input",
    RenderComponent: CustomInput,
    config: {
      type: "text",
      name: "github",
      label: "Github/Twitter Profile (optional)",
      placeholder: "https://github.com/username",
      containerClassName: "col-span-full",
      validation: z.string().min(4, "URL must be at least 2 characters"),
    },
  },

  {
    type: "input",
    RenderComponent: CustomInput,
    config: {
      type: "text",
      name: "portfolio",
      label: "Portfolio Link (optional)",
      containerClassName: "col-span-full",
      placeholder: "https://portfolio.com",
      validation: z.string().min(2, "URL must be at least 2 characters"),
    },
  },
];

const setUpProfile: MagicField[] = [
  {
    type: "input",
    RenderComponent: CustomInput,
    config: {
      type: "text",
      name: "username",
      label: "Username",
      placeholder: "username",
      validation: z.string().min(3, "Username must be at least 2 characters"),
      beforeInput: <AtSign className="h-4 w-4" />,
    },
  },
  {
    type: "textarea",
    RenderComponent: CustomTextArea,
    config: {
      cols: 10,
      name: "bio" as const,
      label: "Bio (Optional)",
      className: "col-span-full",
      placeholder: "Tell us about yourself... ",
      validation: z
        .string()
        .min(10, { message: "Minimum 10 characters" })
        .max(200, { message: "Maximum 200 characters" }), // Add max length
      rows: 1,
    },
  },

  {
    type: "input",
    config: {
      name: "profilePhoto",
      type: "file",
      label: "Profile Photo",
      placeholder: "Upload your Profile Photo",
      validation: z.instanceof(FileList).optional(),
      onChange: (e) => {},
    },
    RenderComponent: CustomInput,
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

    // const audio = new Audio(successSound);
    // audio.play();

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
      <div className="mx-auto flex items-center min-h-screen justify-center w-full px-4 md:px-8">
        <div className="rounded-lg  flex items-center justify-center w-full ">
          <SuccessAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center max-w-6xl px-4 md:px-8">
      <div className="rounded-lg w-full border  h-full shadow-sm">
        <div className="grid md:grid-cols-[300px_1fr] h-full  w-full bg-primary-foreground rounded-lg">
          {/* Left sidebar */}
          <div className="w-full p-6">
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
                    "flex items-center   gap-3 rounded-md p-3 transition-colors",
                    step === i && "bg-secondary"
                  )}
                >
                  <StepIndicator status={getStepStatus(i)} />
                  <div className="text-sm  font-medium">
                    <p className="  align-middle">{s.name}</p>
                    {/* <div className="text-xs text-muted-foreground">
                      {s.description}
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}

          <div className="bg-white border m-3 rounded-md">
            <div className="">
              <div className="flex items-center justify-between border-b  p-6 pb-4">
                <h2 className="text-lg font-medium">{steps[step].name}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {step + 1}/{steps.length} completed
                  </span>
                  <Progress
                    value={((step + 1) / steps.length) * 100}
                    className="w-[100px]"
                  />
                </div>
              </div>

              <div className=" w-full p-6">
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
                          <div className="grid grid-cols-2 gap-6">
                            {personalDetails.map(
                              ({ config, RenderComponent }, i) => (
                                <RenderComponent
                                  key={i}
                                  {...config}
                                  control={form.control}
                                />
                              )
                            )}
                            {/* <Button type="submit">Submit</Button> */}
                          </div>
                        )}

                        {step === 1 && (
                          <div className="grid grid-cols-2  gap-6">
                            {/* Primary Skills */}

                            {technicalProfile.map(
                              ({ config, RenderComponent }, i) => (
                                <RenderComponent
                                  key={i}
                                  {...config}
                                  control={form.control}
                                />
                              )
                            )}
                          </div>
                        )}

                        {step === 2 && (
                          <div className="grid gap-6">
                            {/* Project Type */}

                            {setUpProfile.map(
                              ({ config, RenderComponent }, i) => (
                                <RenderComponent
                                  key={i}
                                  {...config}
                                  control={form.control}
                                />
                              )
                            )}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-2  pt-4">
                      {step > 0 && (
                        <Button type="button" onClick={prev} variant="outline">
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      )}
                      {step < steps.length - 1 && (
                        <Button
                          type="button"
                          onClick={next}
                          className="ml-auto"
                        >
                          Next Step
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {step === steps.length - 1 && (
                        <Button type="submit" className="ml-auto">
                          Complete
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
