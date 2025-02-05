"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtSign, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/components/StepIndicator";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import SelectCommand from "./custom/select-command";
import type { MagicField } from "@/utils/types";
import CustomDatePicker from "./custom/date-picker";
import PhoneNumberInput from "./custom/phone-input";
import CustomTextArea from "./custom/textarea";
import { CustomMultiSelect } from "./custom/multiselect";
import CustomSelect from "./custom/select";
import CustomInput from "./custom/input";
import { onBoardDetails } from "@/utils/actions";
import ImageKit from "imagekit";

const steps = [
  {
    id: "step-1",
    name: "Personal Details",
    fields: ["university", "department", "degreeLevel", "birthday", "phone"],
  },
  {
    id: "step-2",
    name: "Technical Profile",
    fields: ["skills", "experience", "github", "portfolio"],
  },
  {
    id: "step-3",
    name: "Setup Profile",
    fields: ["username", "bio", "profilePhoto"],
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
        { label: "Computer Science", value: "computer_science" },
        { label: "Engineering", value: "engineering" },
        { label: "Design", value: "design" },
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
      validation: z.string().min(2, "Please select a degree level"),
      options: () => [
        { label: "Undergraduate", value: "undergraduate" },
        { label: "Graduate", value: "graduate" },
        { label: "PhD", value: "phd" },
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
      validation: z.string().min(2, "Please select your birthday"),
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
      validation: z
        .string()
        .min(10, "Number must be at least 10 characters")
        .optional(),
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
      validation: z.array(z.string()).min(1, "Select at least one skill"),
      className: "w-full",
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
      validation: z.string().min(3, "Please select an experience level"),
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
      validation: z.string().url("Please enter a valid URL").or(z.literal("")),
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
      validation: z.string().url("Please enter a valid URL").or(z.literal("")),
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
      validation: z.string().min(3, "Username must be at least 3 characters"),
      beforeInput: <AtSign className="h-4 w-4" />,
    },
  },
  {
    type: "textarea",
    RenderComponent: CustomTextArea,
    config: {
      cols: 10,
      name: "bio",
      label: "Bio (Optional)",
      className: "col-span-full",
      placeholder: "Tell us about yourself... ",
      validation: z
        .string()
        .min(10, { message: "Minimum 10 characters" })
        .max(200, { message: "Maximum 200 characters" })
        .optional(),
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
      validation: z.array(z.instanceof(File)).optional(),

      // onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      //   // Handle file change
      // },
    },
    RenderComponent: CustomInput,
  },
];

const formSchema = z.object({
  // Define all fields here
  university: z.string().min(2, "Please select a university"),
  department: z.string().min(2, "Please select a department"),
  degreeLevel: z.string().min(2, "Please select a degree level"),
  birthday: z.date(),
  phone: z.string().min(10, "Number must be at least 10 characters").optional(),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  experience: z.string().min(3, "Please select an experience level"),
  github: z.string().url("Please enter a valid URL").or(z.literal("")),
  portfolio: z.string().url("Please enter a valid URL").or(z.literal("")),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().min(10).max(200).optional(),
  profilePhoto: z.array(z.instanceof(File)).optional(),
});

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [previousStep, setPreviousStep] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: "",
      department: "",
      degreeLevel: "",
      // birthday: new Date(),
      phone: "",
      skills: [],
      experience: "",
      github: "",
      portfolio: "",
      username: "",
      bio: "",
    },
  });

  const uploadImage = async (file: File, fileName: string) => {
    console.log("Starting image upload...");
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY ?? "",
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY ?? "",
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT ?? "",
    });
    const fileBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    console.log("File converted to base64, uploading...");
    const uploadedFile = await imagekit.upload({
      file: fileBase64,
      fileName: fileName,
    });
    console.log("Image upload completed. URL:", uploadedFile.url);
    return uploadedFile.url;
  };

  const processForm = async (data: z.infer<typeof formSchema>) => {
    let profilePhotoUrl = "";
    if (data.profilePhoto && data.profilePhoto.length > 0) {
      const file = data.profilePhoto[0]; // Get the first file from the array
      profilePhotoUrl = await uploadImage(file, data.username); // Pass the File object
      console.log("Profile photo uploaded. URL:", profilePhotoUrl);
    }

    console.log("Form data:", data);

    const formData = new FormData();

    // Append form fields
    Object.entries({
      ...data,
      profilePhoto: profilePhotoUrl,
    }).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    try {
      const response = await onBoardDetails(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < step) return "done";
    if (stepIndex === step) return "ongoing";
    return "pending";
  };

  const next = async () => {
    const fields = steps[step].fields;
    const output = await form.trigger(
      fields as Array<keyof z.infer<typeof formSchema>>,
      { shouldFocus: true }
    );

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
        <div className="rounded-lg flex items-center justify-center w-full ">
          <SuccessAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center max-w-6xl px-4 md:px-8">
      <div className="rounded-lg w-full border h-full shadow-sm">
        <div className="grid md:grid-cols-[300px_1fr] h-full w-full bg-primary-foreground rounded-lg">
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
                    "flex items-center gap-3 rounded-md p-3 transition-colors",
                    step === i && "bg-secondary"
                  )}
                >
                  <StepIndicator status={getStepStatus(i)} />
                  <div className="text-sm font-medium">
                    <p className="align-middle">{s.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="bg-white border m-3 rounded-md">
            <div className="">
              <div className="flex items-center justify-between border-b p-6 pb-4">
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

              <div className="w-full p-6">
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
                          </div>
                        )}

                        {step === 1 && (
                          <div className="grid grid-cols-2 gap-6">
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

                    <div className="flex gap-2 pt-4">
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
