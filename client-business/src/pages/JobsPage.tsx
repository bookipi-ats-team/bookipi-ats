import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs, usePublishJob, usePauseJob, useCloseJob } from "../hooks";
import { Button } from "../components/shared/Button";
import { SearchInput } from "../components/shared/SearchInput";
import { StatusBadge } from "../components/shared/StatusBadge";
import { Spinner } from "../components/shared/Spinner";
import type { JobStatus } from "../types";

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");

  const { data, isLoading } = useJobs({
    q: search,
    status: statusFilter || undefined,
  });
  const publishJob = usePublishJob();
  const pauseJob = usePauseJob();
  const closeJob = useCloseJob();

  const handleAction = async (
    jobId: string,
    action: "publish" | "pause" | "close"
  ) => {
    try {
      if (action === "publish") await publishJob.mutateAsync(jobId);
      else if (action === "pause") await pauseJob.mutateAsync(jobId);
      else if (action === "close") await closeJob.mutateAsync(jobId);
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
    }
  };

  const statusFilters: Array<{ value: JobStatus | ""; label: string }> = [
    { value: "", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "PAUSED", label: "Paused" },
    { value: "CLOSED", label: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Jobs</h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage your job postings and track applications
            </p>
          </div>
          <Button onClick={() => navigate("/jobs/new")}>
            <span className="text-lg">+</span>
            New Job
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search jobs..."
            className="w-80"
          />
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  statusFilter === filter.value
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-text-secondary hover:bg-gray-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.items.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-text-primary">
                          {job.title}
                        </div>
                        <div className="text-sm text-text-secondary mt-0.5">
                          {job.industry || "Not specified"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {job.location || "Remote"}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {job.employmentType.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/jobs/${job._id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/jobs/${job._id}/pipeline`)}
                        >
                          Pipeline
                        </Button>
                        {job.status === "DRAFT" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAction(job._id, "publish")}
                            isLoading={publishJob.isPending}
                          >
                            Publish
                          </Button>
                        )}
                        {job.status === "PUBLISHED" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAction(job._id, "pause")}
                            isLoading={pauseJob.isPending}
                          >
                            Pause
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data?.items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary mb-4">No jobs found</p>
                <Button onClick={() => navigate("/jobs/new")}>
                  Create your first job
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
