const { PrismaClient } = require("@prisma/client");
const { generateMockUsers } = require("../utils/mockData");

const prisma = new PrismaClient();

// Number of fake users to generate
const MOCK_USER_COUNT = 50;

// Flag to mark these as demo/mock users
const IS_DEMO = true;

async function seedMockUsers() {
  console.log(`Seeding ${MOCK_USER_COUNT} mock users...`);

  // Generate mock user data
  const mockUsers = generateMockUsers(MOCK_USER_COUNT);

  let successCount = 0;

  for (const mockUser of mockUsers) {
    try {
      // Create the user first
      const user = await prisma.user.create({
        data: {
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          username: mockUser.username,
          image: mockUser.image,
          bio: mockUser.bio,
          isDemo: IS_DEMO, // Flag to identify mock users
        },
      });

      // Create personal details
      await prisma.personalDetails.create({
        data: {
          userId: user.id,
          university: mockUser.personalDetails.university,
          department: mockUser.personalDetails.department,
          degreeLevel: mockUser.personalDetails.degreeLevel,
          phone: mockUser.personalDetails.phone,
        },
      });

      // Create technical profile
      await prisma.technicalProfile.create({
        data: {
          userId: user.id,
          primarySkills: mockUser.technicalProfile.primarySkills,
          experienceLevel: mockUser.technicalProfile.experienceLevel,
          interests: mockUser.technicalProfile.interests,
          preferredRoles: mockUser.technicalProfile.preferredRoles,
          githubUrl: mockUser.technicalProfile.githubUrl,
          linkedinUrl: mockUser.technicalProfile.linkedinUrl,
          portfolioUrl: mockUser.technicalProfile.portfolioUrl,
          toolsProficiency: mockUser.technicalProfile.toolsProficiency,
        },
      });

      successCount++;
    } catch (error) {
      console.error(`Failed to create mock user ${mockUser.email}:`, error);
    }
  }

  console.log(`Successfully created ${successCount} mock users`);
}

// Function to delete demo users when needed
async function cleanupMockUsers() {
  console.log("Cleaning up mock users...");

  const deletedCount = await prisma.user.deleteMany({
    where: {
      isDemo: true,
    },
  });

  console.log(`Deleted ${deletedCount.count} mock users`);
}

// Execute the seeding
async function main() {
  if (process.argv.includes("--cleanup")) {
    await cleanupMockUsers();
  } else {
    await seedMockUsers();
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
