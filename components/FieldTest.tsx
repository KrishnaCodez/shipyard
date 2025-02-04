"use client";
import { ArrayToZodResolver } from "@/lib/ArrayToZod";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { MagicField } from "@/utils/types";
import CustomSelect from "./custom/select";
import { z } from "zod";
import SelectCommand from "./custom/select-command";
import { Button } from "./ui/button";
import CustomDatePicker from "./custom/date-picker";
import CustomInput from "./custom/input";
import CustomTextArea from "./custom/textarea";
import PhoneNumberInput from "./custom/phone-input";
import { AtSign } from "lucide-react";
import { CustomMultiSelect } from "./custom/multiselect";

const fields: MagicField[] = [
  {
    type: "select",
    RenderComponent: SelectCommand,
    config: {
      name: "framework",
      label: "Framework",
      className: "w-full border",
      placeholder: "Select a framework",
      validation: z.string().min(1, "Please select a framework"),
      options: () => [
        { label: "Next.js", value: "next" },
        { label: "React", value: "react" },
        { label: "Vue", value: "vue" },
      ],
    },
  },
  {
    type: "select",
    RenderComponent: SelectCommand,
    config: {
      name: "city",
      label: "City",
      placeholder: "Select a city",
      className: "",
      validation: z.string().optional(),
      options: () => [],
      conditionalOptions: {
        fieldName: "country",
        fn: async (country: string) => {
          if (country === "us") {
            return [
              { label: "New York", value: "nyc" },
              { label: "San Francisco", value: "sf" },
            ];
          }
          return [];
        },
      },
    },
  },

  {
    type: "input",
    RenderComponent: CustomDatePicker,
    config: {
      type: "input",
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your first name",
      validation: z.string().min(2, "First name must be at least 2 characters"),
      defaultValue: "",
    },
  },

  {
    type: "input",
    RenderComponent: CustomInput,
    config: {
      type: "text",
      name: "checkinput",
      label: "Check Name",
      placeholder: "Enter your first name",
      validation: z.string().min(2, "First name must be at least 2 characters"),
      defaultValue: "",
    },
  },
  {
    type: "textarea",
    RenderComponent: CustomTextArea,
    config: {
      cols: 10,
      name: "message" as const,
      label: "Message",
      placeholder: "Message ",
      validation: z.string().min(2, { message: "Message is required" }),
      rows: 1,
    },
  },

  {
    type: "input",
    RenderComponent: PhoneNumberInput,
    config: {
      type: "phone",
      name: "checkinput",
      label: "Check Name",
      placeholder: "Enter your first name",
      validation: z.string().min(2, "First name must be at least 2 characters"),
    },
  },
  {
    type: "input",
    RenderComponent: CustomInput,
    config: {
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      validation: z.string().email(),
      beforeInput: <AtSign size={16} strokeWidth={2} />,
      containerClassName: "mb-4",
      className: "peer ps-9",
    },
  },
  {
    type: "multiselect",
    RenderComponent: CustomMultiSelect,
    config: {
      name: "skills",
      label: "Technical Skills",
      placeholder: "Select skills...",
      validation: z.array(z.string()).min(1, "Select at least one skill"),
      className: "w-full",
      // Provide your options as an async function:
      options: async () => [
        { value: "react", label: "React" },
        { value: "typescript", label: "TypeScript" },
        { value: "node", label: "Node.js" },
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
];

export default function FieldTest() {
  // const { userId } = await auth();

  // if (!userId) redirect("/sign-in");

  // const user = await prisma.user.findUnique({
  //   where: { clerkId: userId },
  //   select: { onboarded: true },
  // });

  // if (user?.onboarded || !user) {
  //   redirect("/member"); // or wq
  // }
  const form = useForm({
    resolver: ArrayToZodResolver(fields),
    defaultValues: {},
  });

  const onSubmit = async (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <div>
      <h1>Hey... You got it.</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {fields.map(({ config, RenderComponent }, i) => (
            <RenderComponent key={i} {...config} control={form.control} />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
