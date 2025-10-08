import { Job, JobFilters, PaginatedJobsResponse } from '@/types/job';

// Mock data - expanded to have more jobs for pagination testing
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$120k - $180k',
    payRange: '$120k - $180k',
    description: "We're looking for an experienced software engineer to join our growing team. You'll work on challenging problems and help build products used by millions of users worldwide.",
    posted: '2 days ago',
    datePosted: '2024-10-06',
    language: 'English',
    industry: 'Technology',
    bookmarked: false,
    responsibilities: [
      'Design and develop scalable software solutions',
      'Collaborate with cross-functional teams',
      'Mentor junior developers',
      'Participate in code reviews and technical discussions',
      'Contribute to architectural decisions',
    ],
    requirements: [
      '5+ years of software development experience',
      'Strong knowledge of React, TypeScript, and Node.js',
      'Experience with cloud platforms (AWS, GCP, or Azure)',
      'Excellent communication skills',
      "Bachelor's degree in Computer Science or related field",
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      '401(k) matching',
      'Flexible work hours',
      'Remote work options',
      'Professional development budget',
    ],
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Design Studio',
    location: 'Remote',
    type: 'full-time',
    salary: '$90k - $130k',
    payRange: '$90k - $130k',
    description: 'Join our creative team to design beautiful user experiences that delight millions of users.',
    posted: '1 week ago',
    datePosted: '2024-10-01',
    language: 'English',
    industry: 'Design',
    bookmarked: true,
    responsibilities: [
      'Create wireframes, mockups, and prototypes',
      'Conduct user research and usability testing',
      'Collaborate with product and engineering teams',
      'Maintain design systems and style guides',
      'Present design concepts to stakeholders',
    ],
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma, Sketch, or Adobe Creative Suite',
      'Strong understanding of UX/UI principles',
      'Experience with design systems',
      'Portfolio showcasing previous work',
    ],
    benefits: [
      'Fully remote work environment',
      'Health and wellness stipend',
      'Learning and development budget',
      'Flexible vacation policy',
      'Top-tier equipment provided',
    ],
  },
  {
    id: '3',
    title: 'Marketing Manager',
    company: 'Growth Co',
    location: 'New York, NY',
    type: 'full-time',
    salary: '$80k - $120k',
    payRange: '$80k - $120k',
    description: 'Lead our marketing efforts and drive growth...',
    posted: '3 days ago',
    datePosted: '2024-10-05',
    language: 'English',
    industry: 'Marketing',
    bookmarked: false,
  },
  {
    id: '4',
    title: 'Data Analyst',
    company: 'Analytics Inc',
    location: 'Austin, TX',
    type: 'contract',
    salary: '$70k - $100k',
    payRange: '$70k - $100k',
    description: 'Analyze data and provide insights to drive business decisions...',
    posted: '5 days ago',
    datePosted: '2024-10-03',
    language: 'English',
    industry: 'Data & Analytics',
    bookmarked: false,
  },
  {
    id: '5',
    title: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    type: 'part-time',
    salary: '$60k - $90k',
    payRange: '$60k - $90k',
    description: 'Build responsive and interactive web applications...',
    posted: '1 day ago',
    datePosted: '2024-10-07',
    language: 'English',
    industry: 'Technology',
    bookmarked: false,
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    location: 'Seattle, WA',
    type: 'full-time',
    salary: '$110k - $160k',
    payRange: '$110k - $160k',
    description: 'Manage cloud infrastructure and deployment pipelines...',
    posted: '4 days ago',
    datePosted: '2024-10-04',
    language: 'English',
    industry: 'Technology',
    bookmarked: true,
  },
  {
    id: '7',
    title: 'UX Researcher',
    company: 'User Labs',
    location: 'Chicago, IL',
    type: 'full-time',
    salary: '$85k - $125k',
    payRange: '$85k - $125k',
    description: 'Conduct user research to improve product experiences...',
    posted: '6 days ago',
    datePosted: '2024-10-02',
    language: 'English',
    industry: 'Design',
    bookmarked: false,
  },
  {
    id: '8',
    title: 'Sales Representative',
    company: 'SalesCorp',
    location: 'Los Angeles, CA',
    type: 'full-time',
    salary: '$50k - $80k',
    payRange: '$50k - $80k',
    description: 'Drive sales and build relationships with clients...',
    posted: '1 week ago',
    datePosted: '2024-10-01',
    language: 'English',
    industry: 'Sales',
    bookmarked: false,
  },
  {
    id: '9',
    title: 'Content Writer',
    company: 'Content Hub',
    location: 'Remote',
    type: 'contract',
    salary: '$40k - $65k',
    payRange: '$40k - $65k',
    description: 'Create engaging content for various digital platforms...',
    posted: '2 days ago',
    datePosted: '2024-10-06',
    language: 'English',
    industry: 'Marketing',
    bookmarked: false,
  },
  {
    id: '10',
    title: 'Project Manager',
    company: 'PM Solutions',
    location: 'Boston, MA',
    type: 'full-time',
    salary: '$95k - $135k',
    payRange: '$95k - $135k',
    description: 'Lead cross-functional teams to deliver projects on time...',
    posted: '3 days ago',
    datePosted: '2024-10-05',
    language: 'English',
    industry: 'Management',
    bookmarked: true,
  },
  {
    id: '11',
    title: 'QA Engineer',
    company: 'Quality First',
    location: 'Denver, CO',
    type: 'full-time',
    salary: '$75k - $105k',
    payRange: '$75k - $105k',
    description: 'Ensure software quality through comprehensive testing...',
    posted: '5 days ago',
    datePosted: '2024-10-03',
    language: 'English',
    industry: 'Technology',
    bookmarked: false,
  },
  {
    id: '12',
    title: 'Graphic Designer',
    company: 'Creative Agency',
    location: 'Portland, OR',
    type: 'part-time',
    salary: '$45k - $70k',
    payRange: '$45k - $70k',
    description: 'Design visual content for marketing campaigns...',
    posted: '1 week ago',
    datePosted: '2024-10-01',
    language: 'English',
    industry: 'Design',
    bookmarked: false,
  },
];

const JOBS_PER_PAGE = 6;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchJobs = async (
  page: number = 1,
  filters: JobFilters
): Promise<PaginatedJobsResponse> => {
  await delay(800); // Simulate network delay

  // Filter jobs based on provided filters
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = !filters.searchQuery ||
      job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesJobType = filters.jobType === 'all' || job.type === filters.jobType;
    const matchesLocation = filters.location === 'all' || job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesIndustry = filters.industry === 'all' || job.industry === filters.industry;

    // Simple date filtering simulation
    const matchesDatePosted = filters.datePosted === 'all' ||
      (filters.datePosted === '24h' && job.posted.includes('day')) ||
      (filters.datePosted === '7d' && (job.posted.includes('day') || job.posted.includes('week')));

    return matchesSearch && matchesJobType && matchesLocation && matchesIndustry && matchesDatePosted;
  });

  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);
  const startIndex = (page - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const jobs = filteredJobs.slice(startIndex, endIndex);

  return {
    jobs,
    totalJobs,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const fetchJobById = async (id: string): Promise<Job> => {
  await delay(600); // Simulate network delay

  const job = mockJobs.find(job => job.id === id);

  if (!job) {
    throw new Error(`Job with ID ${id} not found`);
  }

  return job;
};