import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useJob,
  useUpdateJob,
  useAISuggestTitles,
  useAISuggestMustHaves,
  useAIGenerateJD,
  useBusiness,
} from "../hooks";
import { Button } from "../components/shared/Button";
import { Spinner } from "../components/shared/Spinner";
import { CANONICAL_INDUSTRIES } from '../utils/industry';
import type { EmploymentType } from "../types";

export const EditJobPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: business } = useBusiness();
  const { data: job, isLoading: jobLoading } = useJob(jobId!);
  const updateJob = useUpdateJob();
  const suggestTitles = useAISuggestTitles();
  const suggestMustHaves = useAISuggestMustHaves();
  const generateJD = useAIGenerateJD();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mustHaves: [] as string[],
    location: "",
    employmentType: "FULL_TIME" as EmploymentType,
    industry: "",
  });

  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [mustHaveInput, setMustHaveInput] = useState("");
  const [mustHaveSuggestions, setMustHaveSuggestions] = useState<string[]>([]);

  // Initialize form with job data
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        mustHaves: job.mustHaves,
        location: job.location || "",
        employmentType: job.employmentType,
        industry: job.industry || "",
      });
    }
  }, [job]);

  const handleGetTitleSuggestions = async () => {
    if (!business) return;
    try {
      const result = await suggestTitles.mutateAsync({
        businessId: business._id,
        industry: business.industry,
        description: business.description,
      });
      setTitleSuggestions(result.items);
    } catch (error) {
      console.error("Failed to get title suggestions:", error);
    }
  };

  const handleGetMustHaveSuggestions = async () => {
    if (!formData.title) return;
    try {
      const result = await suggestMustHaves.mutateAsync({
        jobTitle: formData.title,
        industry: formData.industry,
      });
      setMustHaveSuggestions(result.items);
    } catch (error) {
      console.error("Failed to get must-have suggestions:", error);
    }
  };

  const handleGenerateJD = async () => {
    if (!business || !formData.title) return;
    try {
      const result = await generateJD.mutateAsync({
        jobTitle: formData.title,
        mustHaves: formData.mustHaves,
        business: {
          name: business.name,
          description: business.description,
          industry: business.industry,
        },
      });
      setFormData((prev) => ({ ...prev, description: result.text }));
    } catch (error) {
      console.error("Failed to generate JD:", error);
    }
  };

  const handleAddMustHave = (value: string) => {
    if (value && !formData.mustHaves.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        mustHaves: [...prev.mustHaves, value],
      }));
      setMustHaveInput("");
    }
  };

  const handleRemoveMustHave = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mustHaves: prev.mustHaves.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    try {
      await updateJob.mutateAsync({
        id: jobId,
        data: formData,
      });
      navigate(`/jobs/${jobId}`);
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Job not found</p>
          <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="text-sm text-text-secondary hover:text-text-primary mb-4 flex items-center gap-1"
          >
            ← Back to Job
          </button>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Job</h1>
          <p className="text-sm text-text-secondary mt-1">
            Use AI suggestions to enhance your job posting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title with AI */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-text-secondary">
                  Get AI-powered suggestions for your job title
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleGetTitleSuggestions}
                isLoading={suggestTitles.isPending}
              >
                <span className="text-yellow-500">✨</span>
                Suggest Titles
              </Button>
            </div>

            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all"
              placeholder="e.g., Senior Software Engineer"
            />

            {titleSuggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {titleSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, title: suggestion }))
                    }
                    className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Must-Haves with AI */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Must-Have Skills & Requirements
                </label>
                <p className="text-xs text-text-secondary">
                  Add key requirements or get AI suggestions
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleGetMustHaveSuggestions}
                isLoading={suggestMustHaves.isPending}
                disabled={!formData.title}
              >
                <span className="text-yellow-500">✨</span>
                Suggest Skills
              </Button>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={mustHaveInput}
                onChange={(e) => setMustHaveInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMustHave(mustHaveInput);
                  }
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all"
                placeholder="Type and press Enter to add..."
              />
              <Button
                type="button"
                size="md"
                variant="secondary"
                onClick={() => handleAddMustHave(mustHaveInput)}
              >
                Add
              </Button>
            </div>

            {mustHaveSuggestions.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {mustHaveSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddMustHave(suggestion)}
                    className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.mustHaves.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveMustHave(item)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Description with AI */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-text-secondary">
                  Write a description or generate one with AI
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleGenerateJD}
                isLoading={generateJD.isPending}
                disabled={!formData.title}
              >
                <span className="text-yellow-500">✨</span>
                Generate with AI
              </Button>
            </div>

            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={12}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all resize-none font-mono text-sm"
              placeholder="Enter job description..."
            />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all"
                placeholder="e.g., Makati, Philippines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employmentType: e.target.value as EmploymentType,
                  }))
                }
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all"
              >
                <option value="FULL_TIME">Full-Time</option>
                <option value="PART_TIME">Part-Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Intern</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) =>
                setFormData((prev) => ({ ...prev, industry: e.target.value }))
              }
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all"
              >
                <option value="">Select an industry</option>
                {CANONICAL_INDUSTRIES.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/jobs/${jobId}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={updateJob.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
