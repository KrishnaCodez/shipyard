import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  headline: z
    .string()
    .min(10, "Headline must be at least 10 characters")
    .max(100, "Headline must be less than 100 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  website: z.string().url("Please enter a valid URL"),
  twitter: z.string().min(1, "Twitter handle is required"),
  discord: z.string().min(1, "Discord handle is required"),
  logo: z.any(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  images: z.array(z.any()).optional(),
  releaseDate: z.string(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
