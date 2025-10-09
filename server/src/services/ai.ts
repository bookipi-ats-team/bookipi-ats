import { z } from "zod";
import type {
  GenerateJobDescriptionBody,
  ScoreResumeApplicationBody,
  ScoreResumeInlineBody,
  SuggestJobTitlesBody,
  SuggestMustHavesBody,
} from "../validation/ai.js";
import type { IApplication } from "../models/Application.js";
import type { IJob } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import type { IResumeFile } from "../models/ResumeFile.js";
import { ResumeFile } from "../models/ResumeFile.js";
import type { ChatMessage } from "./openaiClient.js";
import { chatCompletionJson } from "./openaiClient.js";
import { createResumeSummary, normalizeResumeText } from "./resumeParser.js";

export type SuggestionSource = "AI" | "STATIC";

export interface SuggestionListResult {
  items: string[];
  source: SuggestionSource;
}

export interface JobDescriptionResult {
  text: string;
  source: SuggestionSource;
}

interface AiServiceOptions {
  forceStatic?: boolean;
}

interface JobContext {
  title: string;
  mustHaves: string[];
  description?: string;
}

interface ResumePromptData {
  text: string;
  summary: string;
}

export type ScoreResumeReadyResult = {
  status: "ready";
  score: number;
  cvScore: number;
  cvTips: string[];
};

export type ScoreResumePendingResult = {
  status: "pending";
  message: string;
};

export type ScoreResumeFailedResult = {
  status: "failed";
  message: string;
};

export type ScoreResumeResult =
  | ScoreResumeReadyResult
  | ScoreResumePendingResult
  | ScoreResumeFailedResult;

const industryJobTitleMap: Record<string, string[]> = {
  technology: [
    "Software Engineer",
    "Full Stack Developer",
    "Product Manager",
    "DevOps Engineer",
    "Data Analyst",
  ],
  marketing: [
    "Marketing Manager",
    "Growth Marketer",
    "Content Strategist",
    "Performance Marketing Specialist",
    "Brand Manager",
  ],
  finance: [
    "Financial Analyst",
    "Accountant",
    "Finance Manager",
    "Bookkeeper",
    "Revenue Operations Analyst",
  ],
  sales: [
    "Account Executive",
    "Sales Development Representative",
    "Sales Manager",
    "Customer Success Manager",
    "Partnerships Lead",
  ],
  hospitality: [
    "Restaurant Manager",
    "Front of House Supervisor",
    "Head Chef",
    "Event Coordinator",
    "Guest Experience Manager",
  ],
  healthcare: [
    "Registered Nurse",
    "Clinical Coordinator",
    "Medical Assistant",
    "Practice Manager",
    "Care Navigator",
  ],
  retail: [
    "Store Manager",
    "Retail Associate",
    "Visual Merchandiser",
    "Inventory Specialist",
    "Customer Experience Lead",
  ],
};

const keywordJobTitles: Array<{ keywords: RegExp; titles: string[] }> = [
  {
    keywords: /(typescript|node|react|full\s?stack|api)/i,
    titles: [
      "Senior Full Stack Engineer",
      "Backend Engineer",
      "Frontend Engineer",
    ],
  },
  {
    keywords: /(sales|pipeline|crm|quota)/i,
    titles: [
      "Account Executive",
      "Sales Development Representative",
      "Sales Enablement Manager",
    ],
  },
  {
    keywords: /(brand|campaign|content|seo|marketing)/i,
    titles: [
      "Content Marketing Manager",
      "Digital Marketing Specialist",
      "SEO Strategist",
    ],
  },
  {
    keywords: /(finance|accounting|payable|receivable|ledger)/i,
    titles: [
      "Finance Manager",
      "Senior Accountant",
      "Accounts Payable Specialist",
    ],
  },
];

const jobTitleMustHavesMap: Record<string, string[]> = {
  "software engineer": [
    "3+ years building production web applications",
    "Experience with TypeScript and Node.js",
    "Familiarity with cloud platforms (AWS, GCP, or Azure)",
    "Comfortable with automated testing and CI/CD workflows",
  ],
  "product manager": [
    "Experience owning product discovery and delivery",
    "Ability to translate customer insights into roadmaps",
    "Strong stakeholder communication and facilitation skills",
    "Data-informed decision making",
  ],
  "marketing manager": [
    "Track record running multi-channel campaigns",
    "Ability to build and optimize marketing funnels",
    "Hands-on experience with marketing automation tools",
    "Strong copywriting and storytelling skills",
  ],
  "sales manager": [
    "Experience coaching and mentoring sales teams",
    "Ability to forecast and manage pipelines",
    "Proficient with CRM systems",
    "History of exceeding revenue targets",
  ],
  "customer success manager": [
    "Experience managing B2B customer portfolios",
    "Ability to create success plans and drive adoption",
    "Confident hosting QBRs and executive check-ins",
    "Strong cross-functional collaboration",
  ],
  "frontend engineer": [
    "Strong knowledge of modern JavaScript frameworks",
    "Experience building accessible, responsive UIs",
    "Understanding of state management patterns",
    "Comfortable with component-driven development",
  ],
};

const industryMustHaveHints: Record<string, string[]> = {
  technology: [
    "Experience shipping scalable software",
    "Ability to collaborate in agile squads",
    "Comfortable using observability tooling",
  ],
  marketing: [
    "Ability to design experiments and measure lift",
    "Experience collaborating with creative and product teams",
    "Comfortable presenting performance insights to stakeholders",
  ],
  finance: [
    "Knowledge of GAAP and compliance requirements",
    "Proficiency in financial reporting tools",
    "Strong attention to detail and reconciliation skills",
  ],
  healthcare: [
    "Understanding of clinical workflows and patient care",
    "Experience with healthcare compliance standards",
    "Ability to coordinate multidisciplinary teams",
  ],
};

const genericMustHaves: string[] = [
  "Ability to communicate clearly with cross-functional partners",
  "Comfortable working in a fast-paced, ambiguous environment",
  "Organized and proactive with follow-through",
];

const jobTitleResponseSchema = z.object({
  items: z.array(z.string().trim().min(2)).min(1).max(8),
});

const mustHavesResponseSchema = z.object({
  items: z.array(z.string().trim().min(3)).min(3).max(10),
});

const jobDescriptionResponseSchema = z.object({
  text: z.string().trim().min(80).max(4000),
});

const scoreResumeResponseSchema = z.object({
  score: z.number().int().min(0).max(100),
  cvScore: z.number().int().min(0).max(100),
  cvTips: z.array(z.string().trim().min(5)).min(1).max(8),
});

const normalize = (value: string | undefined): string | undefined =>
  value?.trim().toLowerCase();

const unique = (items: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const trimmed = item.trim();

    if (!trimmed) {
      continue;
    }

    if (!seen.has(trimmed.toLowerCase())) {
      seen.add(trimmed.toLowerCase());
      result.push(trimmed);
    }
  }

  return result.slice(0, 8);
};

const maybeEnhanceForSeniority = (mustHaves: string[], seniority?: string): string[] => {
  if (!seniority) {
    return mustHaves;
  }

  const normalizedSeniority = seniority.trim().toLowerCase();

  if (/(senior|lead|principal|head)/.test(normalizedSeniority)) {
    return [
      "Ability to mentor and elevate team members",
      "Track record shaping strategy and influencing roadmaps",
      ...mustHaves,
    ];
  }

  if (/(junior|associate|entry)/.test(normalizedSeniority)) {
    return [
      "Eagerness to learn and grow with coaching",
      "Comfortable asking for help and pairing on tasks",
      ...mustHaves,
    ];
  }

  return mustHaves;
};

const buildApplicationContext = async (
  body: ScoreResumeApplicationBody,
): Promise<{ jobContext?: JobContext; resumeFile?: IResumeFile | null }> => {
  try {
    const application = await Application.findById(body.applicationId)
      .lean<IApplication>()
      .exec();

    if (!application) {
      return {};
    }

    const [job, resumeFile] = await Promise.all([
      Job.findById(application.jobId).lean<IJob>().exec(),
      application.resumeFileId
        ? ResumeFile.findById(application.resumeFileId).lean<IResumeFile>().exec()
        : Promise.resolve(null),
    ]);

    const jobContext = job
      ? {
          title: job.title,
          mustHaves: job.mustHaves ?? [],
          description: job.description,
        }
      : undefined;

    return {
      jobContext,
      resumeFile,
    };
  } catch (error) {
    console.error("Failed to hydrate application context", error);
    return {};
  }
};

const fallbackJobContext = (job: JobContext | undefined, titleHint?: string): JobContext => {
  if (job && job.title) {
    return job;
  }

  return {
    title: titleHint ?? "Role",
    mustHaves: job?.mustHaves ?? genericMustHaves,
    description: job?.description,
  };
};

const buildResumePromptData = (text: string, summary?: string): ResumePromptData => ({
  text,
  summary: summary && summary.trim().length > 0 ? summary : createResumeSummary(text),
});

type ResumeResolution =
  | { status: "ready"; data: ResumePromptData }
  | { status: "pending"; message: string }
  | { status: "failed"; message: string };

const resolveResumeFromFile = (resumeFile?: IResumeFile | null): ResumeResolution => {
  if (!resumeFile) {
    return {
      status: "failed",
      message: "Resume file could not be found.",
    };
  }

  const status = resumeFile.parseStatus ?? "pending";

  if (status === "ready") {
    const text = resumeFile.parsedText?.trim();

    if (!text) {
      return {
        status: "failed",
        message: "Parsed resume text is unavailable.",
      };
    }

    return {
      status: "ready",
      data: buildResumePromptData(text, resumeFile.parsedSummary ?? undefined),
    };
  }

  if (status === "pending" || status === "processing") {
    return {
      status: "pending",
      message: "Resume is still being processed. Please try again shortly.",
    };
  }

  return {
    status: "failed",
    message: resumeFile.parseError?.trim()
      || "Resume parsing failed. Please re-upload the resume.",
  };
};

const resolveResumeFromInlineText = (resumeText: string): ResumeResolution => {
  const normalized = normalizeResumeText(resumeText);

  if (normalized.length < 40) {
    return {
      status: "failed",
      message: "Resume text is too short to score.",
    };
  }

  return {
    status: "ready",
    data: buildResumePromptData(normalized),
  };
};

const scoreFromMustHaves = (mustHaves: string[]): { score: number; cvScore: number; cvTips: string[] } => {
  const normalized = mustHaves
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);

  if (normalized.length === 0) {
    return {
      score: 70,
      cvScore: 68,
      cvTips: [
        "Clarify the most critical requirements for this role",
        "Highlight quantifiable achievements early in the resume",
        "Add a short summary that ties experience to the role",
      ],
    };
  }

  const capped = Math.min(normalized.length, 6);
  const score = Math.min(95, 72 + capped * 4);
  const cvScore = Math.min(90, score - 4);

  const tips = normalized.slice(0, 4).map((item) => `Ensure the resume showcases ${item.toLowerCase()}.`);

  tips.push("Add a short wins section with metrics-backed achievements.");

  return {
    score,
    cvScore,
    cvTips: tips,
  };
};

const logAiFallback = (scope: string, error?: unknown) => {
  if (!error) {
    console.warn(`[AI:${scope}] Falling back to STATIC response.`);
    return;
  }

  const message = error instanceof Error ? error.message : JSON.stringify(error);
  console.warn(`[AI:${scope}] Falling back to STATIC response. Reason: ${message}`);
};

const buildJobTitleMessages = (body: SuggestJobTitlesBody, fallback: string[]): ChatMessage[] => {
  const lines = [
    `Industry: ${body.industry ?? "(unspecified)"}`,
    `Business ID present: ${body.businessId ? "yes" : "no"}`,
    `Role description: ${body.description ?? "(not provided)"}`,
    `Fallback suggestions: ${fallback.join("; ")}`,
  ];

  return [
    {
      role: "system",
      content:
        "You are an ATS assistant helping founders craft job postings. Respond with JSON {\"items\": [\"Title\", ...]} containing 3-6 highly relevant, distinct, title-case job titles. Keep them concise (max 4 words).",
    },
    {
      role: "user",
      content: lines.join("\n"),
    },
  ];
};

const buildMustHaveMessages = (body: SuggestMustHavesBody, fallback: string[]): ChatMessage[] => {
  const lines = [
    `Job title: ${body.jobTitle}`,
    `Industry: ${body.industry ?? "(unspecified)"}`,
    `Seniority: ${body.seniority ?? "(unspecified)"}`,
    `Fallback must-haves: ${fallback.join("; ")}`,
  ];

  return [
    {
      role: "system",
      content:
        "You write laser-focused hiring requirements. Return JSON {\"items\": [\"requirement\", ...]} with 4-6 action-oriented, succinct bullet statements. Reference the role, emphasize impact, avoid redundancy.",
    },
    {
      role: "user",
      content: lines.join("\n"),
    },
  ];
};

const buildJobDescriptionMessages = (
  body: GenerateJobDescriptionBody,
  fallback: string,
): ChatMessage[] => [
  {
    role: "system",
    content:
      "You craft modern job descriptions. Respond ONLY with JSON {\"text\": \"...\"}. Use an energetic, inclusive tone, include a short intro, key responsibilities, must-have summary, and an inviting call to action. Limit to ~250 words.",
  },
  {
    role: "user",
    content: JSON.stringify({
      jobTitle: body.jobTitle,
      business: body.business,
      mustHaves: body.mustHaves,
      extras: body.extras,
      fallback,
    }),
  },
];

const buildScoreResumeMessages = (
  context: JobContext,
  resume: ResumePromptData,
  fallback: { score: number; cvScore: number; cvTips: string[] },
): ChatMessage[] => [
  {
    role: "system",
    content:
      "You evaluate candidate resumes vs. job requirements. Respond with JSON {\"score\": number, \"cvScore\": number, \"cvTips\": [string, ...]}. score=overall fit, cvScore=resume quality. Each between 0 and 100. Provide 3-5 concise, constructive tips.",
  },
  {
    role: "user",
    content: JSON.stringify({
      job: context,
      resume,
      fallback,
    }),
  },
];

export const suggestJobTitles = async (
  body: SuggestJobTitlesBody,
  options?: AiServiceOptions,
): Promise<SuggestionListResult> => {
  const { industry, description } = body;
  const normalizedIndustry = normalize(industry);

  const industrySuggestions = normalizedIndustry ? industryJobTitleMap[normalizedIndustry] ?? [] : [];
  const keywordSuggestions: string[] = [];

  if (description) {
    for (const entry of keywordJobTitles) {
      if (entry.keywords.test(description)) {
        keywordSuggestions.push(...entry.titles);
      }
    }
  }

  const fallbackItems = unique([
    ...(industrySuggestions ?? []),
    ...keywordSuggestions,
    "Operations Manager",
    "Project Coordinator",
    "Team Lead",
  ]);

  const fallbackResponse = {
    items: fallbackItems,
    source: "STATIC" as const,
  };

  if (options?.forceStatic) {
    return fallbackResponse;
  }

  const messages = buildJobTitleMessages(body, fallbackItems);
  const result = await chatCompletionJson({
    messages,
    schema: jobTitleResponseSchema,
    temperature: 0.2,
    functionName: "suggest_job_titles",
  });

  if (result.source === "AI" && result.data) {
    const aiItems = unique(result.data.items);

    if (aiItems.length > 0) {
      return {
        items: aiItems,
        source: "AI",
      };
    }

    logAiFallback("suggestJobTitles", "AI response empty");
  } else if (result.error) {
    logAiFallback("suggestJobTitles", result.error);
  }

  return fallbackResponse;
};

export const suggestMustHaves = async (
  body: SuggestMustHavesBody,
  options?: AiServiceOptions,
): Promise<SuggestionListResult> => {
  const { jobTitle, industry, seniority } = body;
  const normalizedTitle = normalize(jobTitle) ?? "";
  const normalizedIndustry = normalize(industry);

  const titleMatches = jobTitleMustHavesMap[normalizedTitle] ?? [];
  const industryHints = normalizedIndustry ? industryMustHaveHints[normalizedIndustry] ?? [] : [];

  const fallbackItems = unique(
    maybeEnhanceForSeniority(
      [
        ...titleMatches,
        ...industryHints,
        ...genericMustHaves,
      ],
      seniority,
    ),
  );

  const fallbackResponse = {
    items: fallbackItems,
    source: "STATIC" as const,
  };

  if (options?.forceStatic) {
    return fallbackResponse;
  }

  const messages = buildMustHaveMessages(body, fallbackItems);
  const result = await chatCompletionJson({
    messages,
    schema: mustHavesResponseSchema,
    temperature: 0.3,
    functionName: "suggest_must_haves",
  });

  if (result.source === "AI" && result.data) {
    const aiItems = unique(result.data.items);

    if (aiItems.length > 0) {
      return {
        items: aiItems,
        source: "AI",
      };
    }

    logAiFallback("suggestMustHaves", "AI response empty");
  } else if (result.error) {
    logAiFallback("suggestMustHaves", result.error);
  }

  return fallbackResponse;
};

const buildStaticJobDescription = (body: GenerateJobDescriptionBody): string => {
  const { jobTitle, mustHaves, business, extras } = body;
  const header = `Join ${business.name} as our next ${jobTitle}`;
  const aboutBusiness = business.description
    ? business.description
    : `${business.name} is growing quickly and looking to add passionate teammates.`;

  const industryLine = business.industry
    ? `We operate in the ${business.industry} space, serving customers with care.`
    : undefined;

  const normalizedMustHaves = (mustHaves ?? [])
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);

  const mustHaveLines = normalizedMustHaves.length > 0
    ? ["What you'll bring:", ...normalizedMustHaves.map((item: string) => `- ${item}`)]
    : ["What you'll bring:", "- Curiosity to learn quickly", "- Strong collaboration skills"];

  const normalizedExtras = (extras ?? [])
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);

  const extrasLines = normalizedExtras.length > 0
    ? ["Nice to have:", ...normalizedExtras.map((item: string) => `- ${item}`)]
    : [];

  const responsibilities = [
    "What you'll do:",
    "- Partner cross-functionally to deliver meaningful outcomes",
    "- Prioritize work based on customer impact",
    "- Share learnings openly and iterate quickly",
  ];

  const closing = [
    "Ready to apply?",
    "Send your resume along with a short note on why this role is exciting for you.",
  ];

  const sections = [
    header,
    aboutBusiness,
    ...(industryLine ? [industryLine] : []),
    "",
    ...responsibilities,
    "",
    ...mustHaveLines,
    "",
    ...extrasLines,
    extrasLines.length > 0 ? "" : undefined,
    ...closing,
  ].filter((line): line is string => line !== undefined);

  return sections.join("\n");
};

export const generateJobDescription = async (
  body: GenerateJobDescriptionBody,
  options?: AiServiceOptions,
): Promise<JobDescriptionResult> => {
  const fallbackText = buildStaticJobDescription(body);

  if (options?.forceStatic) {
    return {
      text: fallbackText,
      source: "STATIC",
    };
  }

  const messages = buildJobDescriptionMessages(body, fallbackText);

  const result = await chatCompletionJson({
    messages,
    schema: jobDescriptionResponseSchema,
    temperature: 0.4,
    functionName: "generate_job_description",
    maxTokens: 450,
  });

  if (result.source === "AI" && result.data) {
    return {
      text: result.data.text.trim(),
      source: "AI",
    };
  }

  if (result.error) {
    logAiFallback("generateJobDescription", result.error);
  } else {
    logAiFallback("generateJobDescription");
  }

  return {
    text: fallbackText,
    source: "STATIC",
  };
};

export const scoreResume = async (
  body: ScoreResumeApplicationBody | ScoreResumeInlineBody,
  options?: AiServiceOptions,
): Promise<ScoreResumeResult> => {
  let jobContext: JobContext | undefined;
  let resumeResolution: ResumeResolution = {
    status: "failed",
    message: "Resume content is required to score.",
  };
  let titleHint: string | undefined;

  if ("applicationId" in body) {
    const { jobContext: hydratedJob, resumeFile } = await buildApplicationContext(body);
    jobContext = hydratedJob;
    resumeResolution = resolveResumeFromFile(resumeFile);
  } else {
    jobContext = {
      title: body.job.title,
      mustHaves: body.job.mustHaves ?? [],
      description: body.job.description,
    };
    titleHint = body.job.title;

    if (body.resumeText) {
      resumeResolution = resolveResumeFromInlineText(body.resumeText);
    } else if (body.resumeFileId) {
      const resumeFile = await ResumeFile.findById(body.resumeFileId)
        .lean<IResumeFile>()
        .exec();
      resumeResolution = resolveResumeFromFile(resumeFile);
    }
  }

  const resolvedContext = fallbackJobContext(jobContext, titleHint ?? jobContext?.title);
  const fallbackResult = scoreFromMustHaves(resolvedContext.mustHaves);

  if (options?.forceStatic) {
    return {
      status: "ready",
      score: fallbackResult.score,
      cvScore: fallbackResult.cvScore,
      cvTips: fallbackResult.cvTips,
    };
  }

  if (resumeResolution.status === "pending") {
    return {
      status: "pending",
      message: resumeResolution.message,
    };
  }

  if (resumeResolution.status === "failed") {
    return {
      status: "failed",
      message: resumeResolution.message,
    };
  }

  const messages = buildScoreResumeMessages(resolvedContext, resumeResolution.data, fallbackResult);
  const result = await chatCompletionJson({
    messages,
    schema: scoreResumeResponseSchema,
    temperature: 0.1,
    functionName: "score_resume",
  });

  if (result.source === "AI" && result.data) {
    return {
      status: "ready",
      score: result.data.score,
      cvScore: result.data.cvScore,
      cvTips: result.data.cvTips
        .map((tip) => tip.trim())
        .filter((tip) => tip.length > 0),
    };
  }

  if (result.error) {
    logAiFallback("scoreResume", result.error);
  } else {
    logAiFallback("scoreResume");
  }

  return {
    status: "ready",
    score: fallbackResult.score,
    cvScore: fallbackResult.cvScore,
    cvTips: fallbackResult.cvTips,
  };
};
