const { faker } = require("@faker-js/faker");

// Taken from your schema
// type DegreeLevel = "UNDERGRADUATE" | "GRADUATE" | "PHD";
// type ExperienceLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

// Create mock user based on your schema
function createMockUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet
    .userName({ firstName, lastName })
    .toLowerCase();

  const degreeOptions = ["UNDERGRADUATE", "GRADUATE", "PHD"];
  const degreeLevel = faker.helpers.arrayElement(degreeOptions);

  const expOptions = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const experienceLevel = faker.helpers.arrayElement(expOptions);

  // Create department and skills based on a selected field
  const fields = [
    {
      field: "Computer Science",
      skills: [
        "JavaScript",
        "Python",
        "React",
        "Node.js",
        "TypeScript",
        "AWS",
        "GraphQL",
        "Docker",
      ],
    },
    {
      field: "Data Science",
      skills: [
        "Python",
        "R",
        "SQL",
        "Machine Learning",
        "TensorFlow",
        "Data Visualization",
        "Statistics",
      ],
    },
    {
      field: "Design",
      skills: [
        "UI/UX",
        "Figma",
        "Adobe XD",
        "Sketch",
        "User Research",
        "Design Systems",
        "Prototyping",
      ],
    },
    {
      field: "Marketing",
      skills: [
        "SEO",
        "Content Marketing",
        "Social Media",
        "Email Marketing",
        "Analytics",
        "Brand Strategy",
      ],
    },
  ];

  const selectedField = faker.helpers.arrayElement(fields);
  const department = selectedField.field;

  // Choose 2-5 skills from the field's skills array
  const numSkills = faker.number.int({ min: 2, max: 5 });
  const primarySkills = faker.helpers.arrayElements(
    selectedField.skills,
    numSkills
  );

  // Add some random tools
  const tools = [
    "VS Code",
    "IntelliJ",
    "GitHub",
    "GitLab",
    "Jira",
    "Trello",
    "Slack",
    "Notion",
    "Figma",
    "Photoshop",
    "Illustrator",
    "Webflow",
    "Postman",
    "MongoDB Compass",
  ];
  const toolsProficiency = faker.helpers.arrayElements(
    tools,
    faker.number.int({ min: 2, max: 6 })
  );

  // Create user interests from a wide range of topics
  const interestOptions = [
    "Web Development",
    "Mobile Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "Cloud Computing",
    "Game Development",
    "Virtual Reality",
    "Augmented Reality",
    "Internet of Things",
    "Robotics",
    "Big Data",
    "Data Science",
    "UI/UX Design",
    "DevOps",
    "Agile",
    "Product Management",
    "Open Source",
  ];
  const interests = faker.helpers.arrayElements(
    interestOptions,
    faker.number.int({ min: 2, max: 5 })
  );

  // Create preferred roles
  const roleOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "UI/UX Designer",
    "Product Manager",
    "DevOps Engineer",
    "QA Engineer",
    "Machine Learning Engineer",
    "Mobile Developer",
    "Cloud Architect",
  ];
  const preferredRoles = faker.helpers.arrayElements(
    roleOptions,
    faker.number.int({ min: 1, max: 3 })
  );

  // Universities
  const universities = [
    "Stanford University",
    "MIT",
    "Harvard University",
    "UC Berkeley",
    "Carnegie Mellon University",
    "Cornell University",
    "University of Cambridge",
    "California Institute of Technology",
    "University of Oxford",
    "Princeton University",
    "University of Michigan",
    "Georgia Tech",
    "University of Washington",
    "University of Toronto",
    "ETH Zurich",
  ];

  // Return the mock user object
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    username,
    // 70% chance of having an image
    image: faker.helpers.maybe(() => faker.image.avatar(), {
      probability: 0.7,
    }),
    bio: faker.helpers.maybe(() => faker.person.bio(), { probability: 0.8 }),
    personalDetails: {
      university: faker.helpers.arrayElement(universities),
      department,
      degreeLevel,
      phone: faker.helpers.maybe(() => faker.phone.number(), {
        probability: 0.5,
      }),
    },
    technicalProfile: {
      primarySkills,
      experienceLevel,
      interests,
      preferredRoles,
      githubUrl: faker.helpers.maybe(() => `https://github.com/${username}`, {
        probability: 0.8,
      }),
      linkedinUrl: faker.helpers.maybe(
        () => `https://linkedin.com/in/${username}`,
        { probability: 0.7 }
      ),
      portfolioUrl: faker.helpers.maybe(() => `https://${username}.dev`, {
        probability: 0.4,
      }),
      toolsProficiency,
    },
  };
}

// Generate an array of mock users
function generateMockUsers(count) {
  return Array.from({ length: count }, createMockUser);
}

// Export the functions
module.exports = {
  createMockUser,
  generateMockUsers,
};
