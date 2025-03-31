"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle2,
  Globe,
  Twitter,
  MessageSquare,
  Calendar,
  Tag,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { submitProduct } from "@/utils/actions/submitProduct";
import { getCategories } from "@/utils/actions/categoryActions";
import { Badge } from "@/components/ui/badge";

// Define form schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  headline: z
    .string()
    .min(10, "Headline must be at least 10 characters")
    .max(100, "Headline must be less than 100 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  website: z.string().url("Please enter a valid URL"),
  twitter: z.string().min(1, "Twitter handle is required"),
  discord: z.string().min(1, "Discord handle is required"),
  logo: z.any().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  releaseDate: z.string().min(1, "Release date is required"),
});

// Define form type
type ProductFormValues = z.infer<typeof formSchema>;

// Define steps
const steps = [
  {
    id: "step-1",
    title: "Basic Information",
    description: "Tell us about your product",
    icon: <Tag className="h-5 w-5" />,
    fields: ["name", "headline", "description"],
  },
  {
    id: "step-2",
    title: "Media & Links",
    description: "Add visual elements and links",
    icon: <Globe className="h-5 w-5" />,
    fields: ["logo", "website", "categories"],
  },
  {
    id: "step-3",
    title: "Launch Details",
    description: "Configure your product launch",
    icon: <Calendar className="h-5 w-5" />,
    fields: ["releaseDate", "twitter", "discord"],
  },
];

export default function ProductForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState([
    { id: "1", name: "Development" },
    { id: "2", name: "Design" },
    { id: "3", name: "Marketing" },
    { id: "4", name: "Business" },
    { id: "5", name: "Personal Life" },
  ]);
  const router = useRouter();

  // Fetch categories using server action
  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getCategories();
        if (result.categories?.length > 0) {
          setAvailableCategories(result.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Keep using the default categories if fetch fails
      }
    }

    fetchCategories();
  }, []);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      headline: "",
      description: "",
      website: "",
      twitter: "",
      discord: "",
      releaseDate: new Date().toISOString().split("T")[0],
      categories: [],
    },
  });

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];
    form.setValue("logo", file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(categoryId);
      const newSelection = isSelected
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      form.setValue("categories", newSelection);
      return newSelection;
    });
  };

  // Form submission
  const processForm = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Add all form fields
      formData.append("name", data.name);
      formData.append("headline", data.headline);
      formData.append("description", data.description);
      formData.append("website", data.website);
      formData.append("twitter", data.twitter);
      formData.append("discord", data.discord);
      formData.append("releaseDate", data.releaseDate);

      // Handle logo file
      if (data.logo instanceof File) {
        formData.append("logo", data.logo);
      }

      // Handle categories array
      if (Array.isArray(data.categories)) {
        data.categories.forEach((category) => {
          formData.append("categories", category);
        });
      }

      const result = await submitProduct(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      setIsSuccess(true);
      toast.success("Product submitted successfully!");

      // Redirect after showing success animation
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation
  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(
      fields as Array<keyof ProductFormValues>,
      { shouldFocus: true }
    );

    if (!output) {
      toast.error("Please fix the errors before proceeding");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Show success state
  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card className="overflow-hidden">
          <CardContent className="pt-6 pb-8 px-6">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Product Submitted!</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Your product has been submitted successfully and is now awaiting
                approval. We'll notify you once it's been reviewed.
              </p>
              <Button className="mt-6" onClick={() => router.push("/products")}>
                View All Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit Your Product</h1>
        <p className="text-muted-foreground mt-2">
          Share your creation with the community and get valuable feedback
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground/50"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div
                className={`h-1 flex-1 ${
                  index < steps.length - 1
                    ? index < currentStep
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                    : "hidden"
                }`}
              />
            </div>
            <div className="mt-2">
              <p
                className={`text-sm font-medium ${
                  index <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                {step.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {steps[currentStep].description}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(processForm)}
              className="space-y-6"
            >
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your product name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The name of your product as it will appear on the
                          platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="A short, catchy headline for your product"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description that captures what your product
                          does (max 100 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product in detail"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive description of your product,
                          its features, and benefits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              <div className="flex-1">
                                <Input
                                  id="logo-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="cursor-pointer"
                                  {...fieldProps}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  document
                                    .getElementById("logo-upload")
                                    ?.click()
                                }
                                className="flex items-center gap-2"
                              >
                                <Upload className="h-4 w-4" />
                                <span>Upload</span>
                              </Button>
                            </div>

                            {logoPreview ? (
                              <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                <Image
                                  src={logoPreview || "/placeholder.svg"}
                                  alt="Logo preview"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed">
                                <p className="text-sm text-muted-foreground">
                                  No logo uploaded
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a logo for your product (recommended size:
                          512x512px)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="https://yourproduct.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          The official website for your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {availableCategories.map((category) => (
                                <Badge
                                  key={category.id}
                                  variant={
                                    selectedCategories.includes(category.id)
                                      ? "default"
                                      : "outline"
                                  }
                                  className="cursor-pointer px-3 py-1 text-sm"
                                  onClick={() => toggleCategory(category.id)}
                                >
                                  {category.name}
                                </Badge>
                              ))}
                            </div>
                            {selectedCategories.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                Selected: {selectedCategories.length}{" "}
                                {selectedCategories.length === 1
                                  ? "category"
                                  : "categories"}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Select at least one category that best describes your
                          product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="date" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          When was or will your product be released?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Handle</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="yourproduct"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your product's Twitter handle (without the @)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discord"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord Server</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="discord.gg/yourserver"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your product's Discord server invite code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            type="button"
            variant="outline"
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={next}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={form.handleSubmit(processForm)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
