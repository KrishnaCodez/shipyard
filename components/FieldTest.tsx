"use client";
import { ArrayToZodResolver } from "@/lib/ArrayToZod";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { MagicField } from "@/utils/types";
import CustomSelect from "./custom/select";
import { z } from "zod";
import SelectCommand from "./custom/SelectCommand";
import { Button } from "./ui/button";
import CustomDatePicker from "./custom/date-picker";

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
