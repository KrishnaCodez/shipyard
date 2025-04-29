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
      
      IMPORTANT: The database stores skills with specific technology names, not generic categories.
      
      TECHNOLOGY MAPPINGS:
      - For "web development" or "web developers", search for: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Angular", "Vue", "Next.js", "Node.js"]
      - For "mobile development", search for: ["React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS"]
      - For "data science", search for: ["Python", "R", "SQL", "TensorFlow", "PyTorch", "Pandas", "NumPy"]
      - For "cloud", search for: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"]
      - For "backend", search for: ["Node.js", "Java", "Python", "C#", "Go", "Ruby", "PHP", "Express"]
      - For "frontend", search for: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Angular", "Vue"]
      
      Your task is to create a query that:
      1. Maps general categories to specific technologies
      2. Includes BOTH capitalized and lowercase versions of technologies
      3. Always searches for specific technologies, not generic terms
      4. Limit results to 10 users
      5. Include personalDetails and technicalProfile in the results
      
      For experience levels:
      - "experienced" or "with experience" should filter for INTERMEDIATE or ADVANCED
      - "beginners" should filter for BEGINNER
      
      Return only a valid Prisma query like:
      prisma.user.findMany({
        where: {
          technicalProfile: {
            primarySkills: {
              hasSome: ["React", "react", "JavaScript", "javascript", "TypeScript", "typescript"]
            },
            experienceLevel: {
              in: ["INTERMEDIATE", "ADVANCED"]
            }
          }
        },
        include: {
          personalDetails: true,
          technicalProfile: true
        },
        take: 10
      })`,
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
