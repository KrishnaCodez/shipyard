"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";

// Define the schema for AI generation
const querySchema = z.object({
  prismaQuery: z
    .string()
    .describe("The Prisma query code to execute against the database"),
  explanation: z
    .string()
    .describe("A plain English explanation of what the query does"),
});

// Define type for the schema
type QuerySchemaType = z.infer<typeof querySchema>;

function isPrismaQuerySafe(query: string): boolean {
  // Safety check function remains the same
  const allowedMethods = [
    "findMany",
    "findUnique",
    "findFirst",
    "count",
    "aggregate",
  ];

  const methodPattern = /\.(findMany|findUnique|findFirst|count|aggregate)\(/g;
  const matches = query.match(methodPattern) || [];

  const onlyHasSafeMethods = matches.every((match) => {
    const method = match.slice(1, -1);
    return allowedMethods.includes(method);
  });

  const hasNoDeleteOrUpdate =
    !query.includes(".delete") &&
    !query.includes(".update") &&
    !query.includes(".create") &&
    !query.includes(".upsert");

  const startsWith = query.trim().startsWith("prisma.");

  return onlyHasSafeMethods && hasNoDeleteOrUpdate && startsWith;
}

export async function suggestPeople(userQuery: string) {
  try {
    // Generate the Prisma query using AI
    const response = await generateObject({
      model: google("gemini-2.0-flash-001"),
      system: `You are an AI assistant that creates Prisma ORM queries based on natural language.
      
      DATABASE SCHEMA:
      model User {
        id                String            @id @default(cuid())
        image             String            @default("")
        firstName         String            @default("")
        lastName          String            @default("")
        email             String            @unique
        username          String
        bio               String?           @db.VarChar(200)
        role              Role              @default(USER)
        onboarded         Boolean           @default(false)
        personalDetails   PersonalDetails?
        technicalProfile  TechnicalProfile?
      }
      
      model PersonalDetails {
        id             String      @id @default(cuid())
        user           User        @relation(fields: [userId], references: [id], onDelete: Cascade)
        userId         String      @unique
        university     String
        department     String
        degreeLevel    DegreeLevel // (UNDERGRADUATE, GRADUATE, PHD)
        phone          String?
      }
      
      model TechnicalProfile {
        id               String          @id @default(cuid())
        user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
        userId           String          @unique
        primarySkills    String[]
        experienceLevel  ExperienceLevel // (BEGINNER, INTERMEDIATE, ADVANCED)
        interests        String[]
        preferredRoles   String[]
        githubUrl        String?
        linkedinUrl      String?
      }
      
      Your task is to generate Prisma client code that:
      1. Always use the prisma client correctly with proper syntax
      2. Limit results to 10 users unless specified otherwise
      3. Return complete user objects with related data
      4. For array fields, use 'has' for single item checks or 'hasSome' for multiple items
      5. For text searches on normal fields, use 'contains' for case-insensitive searches
      6. Return a JavaScript code snippet that would be executed with prisma client
      7. Do NOT use $queryRaw or $queryRawUnsafe - use Prisma's type-safe query methods
      
      IMPORTANT SEARCH BEST PRACTICES:
      1. For technical skills, always expand searches to include related technologies:
         - For "web development": include ["React", "JavaScript", "HTML", "CSS", "Angular", "Vue"]
         - For "mobile": include ["React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS"]
         - For "AI": include ["Machine Learning", "TensorFlow", "PyTorch", "Deep Learning"]

      2. Always use substring matching for role-based searches:
         - When searching for "developer", match "Full Stack Developer", "Frontend Developer", etc.
         - Use contains() operator for substring matching on string fields
         - For array fields with exact values, use case variants and similar concepts

      3. When possible, search across multiple fields:
         - Check primarySkills, preferredRoles, AND interests
         - Use separate OR clauses for each match type
         - Look for both exact and partial matches in role fields

      4. For specific technologies like "React":
         - Include variations: ["React", "react", "ReactJS", "React.js"]
         - Include parent categories: ["Web Development", "Frontend"]
         - Include related technologies: ["JavaScript", "TypeScript", "NextJS"]

      5. For broader terms like "web":
         - Check if the term exists as substring in roles: preferredRoles: { hasSome: [...] }
         - Create an OR clause for substring search: { preferredRoles: { some: { contains: "web" } } }
         - Check interests for related concepts: { interests: { hasSome: ["Web Development", "Frontend"] } }

      ALWAYS include all these search approaches for maximum relevance.`,
      messages: [
        {
          role: "user",
          content: userQuery,
        },
      ],
      schema: querySchema,
    });

    // Extract the generated values
    const data = response.object;
    const prismaQuery = data.prismaQuery;
    const explanation = data.explanation;

    console.log("Generated Prisma Query:", prismaQuery);
    console.log("Explanation:", explanation);

    // Safety check
    if (!isPrismaQuerySafe(prismaQuery)) {
      throw new Error("Generated query contains unsafe operations");
    }

    // Execute the Prisma query safely
    try {
      const queryFunction = new Function("prisma", `return ${prismaQuery}`);
      const results = await queryFunction(prisma);

      return {
        results: results || [], // Ensure we always return an array
        explanation,
        prismaQuery,
      };
    } catch (queryError) {
      console.error("Error executing query:", queryError);
      throw new Error(
        `Failed to execute query: ${queryError instanceof Error ? queryError.message : String(queryError)}`
      );
    }
  } catch (error) {
    console.error(
      "Error suggesting people:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("Failed to suggest people based on your query");
  }
}
