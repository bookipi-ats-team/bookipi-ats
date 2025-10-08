import { useParams, useNavigate } from 'react-router-dom';
import { useJob, useApplications, usePublishJob, usePauseJob, useCloseJob } from '../hooks';
import { Button } from '../components/shared/Button';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Spinner } from '../components/shared/Spinner';
import type { ApplicationStage } from '../types';

export const JobSummaryPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading: jobLoading } = useJob(jobId!);
  const { data: applications } = useApplications(jobId!);
  const publishJob = usePublishJob();
  const pauseJob = usePauseJob();
  const closeJob = useCloseJob();

  const handleAction = async (action: 'publish' | 'pause' | 'close') => {
    if (!jobId) return;
    try {
      if (action === 'publish') await publishJob.mutateAsync(jobId);
      else if (action === 'pause') await pauseJob.mutateAsync(jobId);
      else if (action === 'close') await closeJob.mutateAsync(jobId);
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
    }
  };

  const getStageCount = (stage: ApplicationStage) => {
    return applications?.items.filter(app => app.stage === stage).length || 0;
  };

  const stageCounts = {
    NEW: getStageCount('NEW'),
    SCREEN: getStageCount('SCREEN'),
    INTERVIEW: getStageCount('INTERVIEW'),
    OFFER: getStageCount('OFFER'),
    HIRED: getStageCount('HIRED'),
    REJECTED: getStageCount('REJECTED'),
  };

  const totalApplicants = applications?.items.length || 0;

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
          <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/jobs')}
            className="text-sm text-text-secondary hover:text-text-primary mb-4 flex items-center gap-1"
          >
            ← Back to Jobs
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start flex-col gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-text-primary">{job.title}</h1>
                <StatusBadge status={job.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span>📍 {job.location || 'Remote'}</span>
                <span>💼 {job.employmentType.replace('_', ' ')}</span>
                <span>🏢 {job.industry || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {job.status === 'DRAFT' && (
                <Button
                  onClick={() => handleAction('publish')}
                  isLoading={publishJob.isPending}
                >
                  Publish Job
                </Button>
              )}
              {job.status === 'PUBLISHED' && (
                <Button
                  variant="secondary"
                  onClick={() => handleAction('pause')}
                  isLoading={pauseJob.isPending}
                >
                  Pause
                </Button>
              )}
              {job.status === 'PAUSED' && (
                <Button
                  onClick={() => handleAction('publish')}
                  isLoading={publishJob.isPending}
                >
                  Resume
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => handleAction('close')}
                isLoading={closeJob.isPending}
              >
                Close Job
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/jobs/${jobId}/pipeline`)}
              >
                View Pipeline
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-border rounded-xl p-4">
            <div className="text-2xl font-bold text-text-primary">{totalApplicants}</div>
            <div className="text-sm text-text-secondary mt-1">Total Applicants</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-700">{stageCounts.NEW}</div>
            <div className="text-sm text-blue-600 mt-1">New</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-700">{stageCounts.SCREEN + stageCounts.INTERVIEW}</div>
            <div className="text-sm text-purple-600 mt-1">In Progress</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-700">{stageCounts.HIRED}</div>
            <div className="text-sm text-green-600 mt-1">Hired</div>
          </div>
        </div>

        {/* Pipeline Stages Overview */}
        <div className="bg-white border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Pipeline Overview</h2>
          <div className="grid grid-cols-6 gap-3">
            {Object.entries(stageCounts).map(([stage, count]) => (
              <div key={stage} className="text-center">
                <div className="text-xl font-bold text-text-primary">{count}</div>
                <div className="text-xs text-text-secondary uppercase mt-1">{stage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Job Description</h2>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-text-secondary leading-relaxed">
              {job.description}
            </pre>
          </div>
        </div>

        {/* Must-Haves */}
        {job.mustHaves.length > 0 && (
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Requirements</h2>
            <div className="flex flex-wrap gap-2">
              {job.mustHaves.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
