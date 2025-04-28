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
      
      IMPORTANT: For technology and skill searches, generate multiple variants to find more results:
      - When searching for technologies, use hasSome with an array of variations
      - For example, searching for "react" should look for ["react", "reactjs", "react.js"]
      - For a technology like "next", use ["next", "next.js", "nextjs"]
      - For "python", consider ["python", "python3", "py"]
      
      IMPORTANT: For array fields like primarySkills, interests, or preferredRoles:
      - Use 'has' operator like: primarySkills: { has: "javascript" }
      - Or preferably use array operations like: primarySkills: { hasSome: ["react", "reactjs", "react.js"] }
      - Do NOT use 'some' with 'contains' for array fields as it's not valid Prisma syntax
      
      IMPORTANT: Return ONLY valid Prisma client JavaScript code that can be directly evaluated, like:
      prisma.user.findMany({
        where: {...},
        include: {...},
        take: 10
      })
      `,
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
