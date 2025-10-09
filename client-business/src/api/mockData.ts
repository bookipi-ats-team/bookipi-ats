import type {
  User,
  Business,
  Job,
  Applicant,
  ApplicationWithDetails,
  Note,
  AISuggestionResponse,
  AIGenerateJDResponse,
} from "../types";

// Mock User
export const mockUser: User = {
  _id: "u-1",
  email: "owner@bookipi.com",
  name: "John Doe",
  role: "OWNER",
  businessId: "b-1",
};

// Mock Business
export const mockBusiness: Business = {
  _id: 'b-1',
  name: 'Bookipi Tech Solutions',
  description: 'Leading software development company',
  industry: 'technology_and_digital_services',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock Jobs
export const mockJobs: Job[] = [
  {
    _id: 'j-1',
    businessId: 'b-1',
    title: 'Senior Software Engineer',
    description: 'We are looking for an experienced software engineer...',
    mustHaves: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
    location: 'Makati, Philippines',
    employmentType: 'FULL_TIME' as const,
    industry: 'technology_and_digital_services',
    status: 'PUBLISHED' as const,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'j-2',
    businessId: 'b-1',
    title: 'Product Manager',
    description: 'Seeking a product manager to lead our mobile app team...',
    mustHaves: ['Product strategy', 'Agile', 'Mobile apps', '3+ years PM experience'],
    location: 'Remote',
    employmentType: 'FULL_TIME' as const,
    industry: 'technology_and_digital_services',
    status: 'PUBLISHED' as const,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'j-3',
    businessId: 'b-1',
    title: 'UX Designer',
    description: 'Join our design team to create beautiful user experiences...',
    mustHaves: ['Figma', 'User research', 'Prototyping', 'Portfolio'],
    location: 'BGC, Philippines',
    employmentType: 'FULL_TIME' as const,
    industry: 'technology_and_digital_services',
    status: 'DRAFT' as const,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Applicants
export const mockApplicants: Applicant[] = [
  {
    _id: "a-1",
    email: "maria.santos@email.com",
    name: "Maria Santos",
    phone: "+639171234567",
    location: "Quezon City, Philippines",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "a-2",
    email: "juan.dela.cruz@email.com",
    name: "Juan Dela Cruz",
    phone: "+639181234567",
    location: "Makati, Philippines",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "a-3",
    email: "anna.reyes@email.com",
    name: "Anna Reyes",
    phone: "+639191234567",
    location: "Taguig, Philippines",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "a-4",
    email: "miguel.garcia@email.com",
    name: "Miguel Garcia",
    phone: "+639201234567",
    location: "Pasig, Philippines",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Applications
export const mockApplications: ApplicationWithDetails[] = [
  {
    _id: "app-1",
    applicantId: "a-1",
    jobId: "j-1",
    businessId: "b-1",
    stage: "NEW",
    score: 85,
    cvScore: 78,
    cvTips: [
      "Add more quantifiable achievements",
      "Include links to GitHub projects",
    ],
    notesCount: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicant: mockApplicants[0],
    job: mockJobs[0],
  },
  {
    _id: "app-2",
    applicantId: "a-2",
    jobId: "j-1",
    businessId: "b-1",
    stage: "SCREEN",
    score: 92,
    cvScore: 88,
    cvTips: ["Great resume! Consider adding certifications"],
    notesCount: 1,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicant: mockApplicants[1],
    job: mockJobs[0],
  },
  {
    _id: "app-3",
    applicantId: "a-3",
    jobId: "j-1",
    businessId: "b-1",
    stage: "INTERVIEW",
    score: 88,
    cvScore: 82,
    notesCount: 3,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    applicant: mockApplicants[2],
    job: mockJobs[0],
  },
  {
    _id: "app-4",
    applicantId: "a-4",
    jobId: "j-2",
    businessId: "b-1",
    stage: "NEW",
    score: 75,
    cvScore: 70,
    cvTips: [
      "Add more details about product launches",
      "Include metrics and outcomes",
    ],
    notesCount: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicant: mockApplicants[3],
    job: mockJobs[1],
  },
];

// Mock Notes
export const mockNotes: Record<string, Note[]> = {
  "app-1": [
    {
      _id: "n-1",
      applicationId: "app-1",
      authorId: "u-1",
      body: "Strong technical background. Let's schedule a phone screen.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "n-2",
      applicationId: "app-1",
      authorId: "u-1",
      body: "Candidate confirmed availability for next week.",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "app-2": [
    {
      _id: "n-3",
      applicationId: "app-2",
      authorId: "u-1",
      body: "Excellent match! Moving to interview stage.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "app-3": [
    {
      _id: "n-4",
      applicationId: "app-3",
      authorId: "u-1",
      body: "First interview went well. Technical skills are solid.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "n-5",
      applicationId: "app-3",
      authorId: "u-1",
      body: "Scheduling second round with team lead.",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "n-6",
      applicationId: "app-3",
      authorId: "u-1",
      body: "Team feedback: very positive. Considering offer.",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// AI Mock Responses
export const mockJobTitleSuggestions: AISuggestionResponse = {
  items: [
    "Senior Software Engineer",
    "Full Stack Developer",
    "Backend Engineer",
    "Frontend Developer",
    "DevOps Engineer",
  ],
  source: "STATIC",
};

export const mockMustHaveSuggestions: AISuggestionResponse = {
  items: [
    "React",
    "TypeScript",
    "Node.js",
    "REST APIs",
    "5+ years experience",
    "Agile/Scrum",
    "Problem solving",
    "Team collaboration",
  ],
  source: "STATIC",
};

export const mockGeneratedJD: AIGenerateJDResponse = {
  text: `About the Role

We're looking for a talented professional to join our growing team. This is an exciting opportunity to work on challenging projects and make a real impact.

Key Responsibilities
• Develop and maintain high-quality software solutions
• Collaborate with cross-functional teams to deliver projects
• Participate in code reviews and technical discussions
• Contribute to architectural decisions and best practices
• Mentor junior team members

Requirements
• Strong technical skills and problem-solving abilities
• Excellent communication and teamwork skills
• Self-motivated with a passion for learning
• Ability to work in a fast-paced environment

What We Offer
• Competitive salary and benefits
• Flexible work arrangements
• Professional development opportunities
• Collaborative and inclusive culture`,
};
