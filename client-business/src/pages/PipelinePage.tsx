import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  useJob,
  useApplications,
  useMoveApplication,
  useNotes,
  useAddNote,
} from "../hooks";
import { Button } from "../components/shared/Button";
import { ScorePill } from "../components/shared/ScorePill";
import { Spinner } from "../components/shared/Spinner";
import type { ApplicationStage, ApplicationWithDetails } from "../types";
import { getMatchScore, getCVScore } from "../utils/scores";

const STAGES: ApplicationStage[] = [
  "NEW",
  "SCREEN",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

const STAGE_CONFIG: Record<ApplicationStage, { label: string; color: string }> =
  {
    NEW: { label: "New", color: "bg-blue-50 border-blue-200" },
    SCREEN: { label: "Screening", color: "bg-purple-50 border-purple-200" },
    INTERVIEW: { label: "Interview", color: "bg-yellow-50 border-yellow-200" },
    OFFER: { label: "Offer", color: "bg-green-50 border-green-200" },
    HIRED: { label: "Hired", color: "bg-emerald-50 border-emerald-200" },
    REJECTED: { label: "Rejected", color: "bg-red-50 border-red-200" },
  };

interface ApplicationCardProps {
  application: ApplicationWithDetails;
  onClick: () => void;
  isDragging?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onClick,
  isDragging = false,
}) => {
  const matchScore = getMatchScore(application.applicantId, application.score);
  const cvScore = getCVScore(application.applicantId, application.cvScore);

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="font-medium text-text-primary text-sm mb-1 truncate">
        {application.applicant.name}
      </div>
      <div className="text-xs text-text-secondary mb-2 truncate">
        {application.applicant.email}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <ScorePill score={matchScore} label="Match" />
          <ScorePill score={cvScore} label="CV" />
        </div>
        {application.notesCount > 0 && (
          <span className="text-xs text-text-secondary whitespace-nowrap">
            💬 {application.notesCount}
          </span>
        )}
      </div>
      <div className="text-[10px] text-text-secondary mt-2">
        {new Date(application.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

interface DroppableColumnProps {
  stage: ApplicationStage;
  applications: ApplicationWithDetails[];
  onCardClick: (app: ApplicationWithDetails) => void;
  isDragOver?: boolean;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  stage,
  applications,
  onCardClick,
  isDragOver = false,
}) => {
  const config = STAGE_CONFIG[stage];

  return (
    <div className="flex flex-col h-full min-w-0">
      <div
        className={`${config.color} border rounded-xl p-3 mb-3 flex-shrink-0`}
      >
        <div className="font-semibold text-sm text-text-primary">
          {config.label}
        </div>
        <div className="text-xs text-text-secondary mt-0.5">
          {applications.length} applicants
        </div>
      </div>
      <div
        className={`flex-1 space-y-2 overflow-y-auto pr-1 min-h-[200px] ${
          isDragOver ? "bg-blue-50 rounded-lg" : ""
        }`}
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        {applications.map((app) => (
          <div
            key={app._id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify({ id: app._id, stage })
              );
            }}
          >
            <ApplicationCard
              application={app}
              onClick={() => onCardClick(app)}
            />
          </div>
        ))}
        {applications.length === 0 && (
          <div className="text-center text-text-secondary text-xs py-4">
            No applicants
          </div>
        )}
      </div>
    </div>
  );
};

export const PipelinePage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: job } = useJob(jobId!);
  const { data: applicationsData } = useApplications(jobId!);
  const moveApplication = useMoveApplication();

  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(
    null
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [dragOverStage, setDragOverStage] = useState<ApplicationStage | null>(
    null
  );

  const { data: notes } = useNotes(selectedApp?._id || "");
  const addNote = useAddNote();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const applications = useMemo(
    () => applicationsData?.items || [],
    [applicationsData?.items]
  );

  const groupedApplications = STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter((app) => app.stage === stage);
    return acc;
  }, {} as Record<ApplicationStage, ApplicationWithDetails[]>);

  // Auto-select applicant from URL parameter
  useEffect(() => {
    const applicantId = searchParams.get('applicant');
    if (applicantId && applications.length > 0 && !selectedApp) {
      const app = applications.find(a => a._id === applicantId);
      if (app) {
        setSelectedApp(app);
      }
    }
  }, [applications, searchParams, selectedApp]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverStage(null);

    if (!over || active.id === over.id) return;

    const appId = active.id as string;
    const newStage = over.id as ApplicationStage;

    moveApplication.mutate({
      id: appId,
      data: { stage: newStage },
    });
  };

  const handleAddNote = async () => {
    if (!selectedApp || !noteText.trim()) return;

    try {
      await addNote.mutateAsync({
        applicationId: selectedApp._id,
        data: { body: noteText },
      });
      setNoteText("");
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const activeApplication = applications.find((app) => app._id === activeId);

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Main Pipeline */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col min-w-0">
        <div className="mb-6 flex-shrink-0">
          <button
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="text-sm text-text-secondary hover:text-text-primary mb-4 flex items-center gap-1"
          >
            ← Back to Job
          </button>
          <h1 className="text-2xl font-semibold text-text-primary">
            {job.title}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Pipeline Management
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className="grid gap-4 flex-1 overflow-x-auto pb-4"
            style={{
              gridTemplateColumns: "repeat(6, minmax(220px, 1fr))",
            }}
          >
            {STAGES.map((stage) => (
              <div
                key={stage}
                id={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage);
                }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  const data = e.dataTransfer.getData("application/json");
                  if (data) {
                    const { id } = JSON.parse(data);
                    moveApplication.mutate({
                      id,
                      data: { stage },
                    });
                  }
                  setDragOverStage(null);
                }}
                className="min-w-0"
              >
                <DroppableColumn
                  stage={stage}
                  applications={groupedApplications[stage]}
                  onCardClick={setSelectedApp}
                  isDragOver={dragOverStage === stage}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeApplication && (
              <div className="bg-white border-2 border-primary rounded-lg p-3 shadow-lg opacity-90 w-[220px]">
                <div className="font-medium text-text-primary text-sm truncate">
                  {activeApplication.applicant.name}
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Side Panel */}
      {selectedApp && (
        <div className="w-80 border-l border-border bg-gray-50 overflow-y-auto flex-shrink-0">
          <div className="sticky top-0 bg-white border-b border-border p-3 flex items-center justify-between z-10">
            <h2 className="font-semibold text-text-primary text-sm">Details</h2>
            <button
              onClick={() => setSelectedApp(null)}
              className="text-text-secondary hover:text-text-primary text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="p-3 space-y-3">
            {/* Applicant Info */}
            <div className="bg-white rounded-lg p-3 border border-border">
              <h3 className="font-semibold text-text-primary text-xs mb-2">
                Applicant
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-text-secondary">Name</div>
                  <div className="text-text-primary font-medium">
                    {selectedApp.applicant.name}
                  </div>
                </div>
                <div>
                  <div className="text-text-secondary">Email</div>
                  <div className="text-text-primary break-all">
                    {selectedApp.applicant.email}
                  </div>
                </div>
                {selectedApp.applicant.phone && (
                  <div>
                    <div className="text-text-secondary">Phone</div>
                    <div className="text-text-primary">
                      {selectedApp.applicant.phone}
                    </div>
                  </div>
                )}
                {selectedApp.applicant.location && (
                  <div>
                    <div className="text-text-secondary">Location</div>
                    <div className="text-text-primary">
                      {selectedApp.applicant.location}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scores */}
            <div className="bg-white rounded-lg p-3 border border-border">
              <h3 className="font-semibold text-text-primary text-xs mb-2">
                Scores
              </h3>
              <div className="flex gap-2 flex-wrap">
                <ScorePill 
                  score={getMatchScore(selectedApp.applicantId, selectedApp.score)} 
                  label="Job Match" 
                />
                <ScorePill 
                  score={getCVScore(selectedApp.applicantId, selectedApp.cvScore)} 
                  label="CV Quality" 
                />
              </div>
              {selectedApp.cvTips && selectedApp.cvTips.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-text-secondary mb-1">
                    CV Tips
                  </div>
                  <ul className="space-y-1">
                    {selectedApp.cvTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-text-secondary leading-tight"
                      >
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg p-3 border border-border">
              <h3 className="font-semibold text-text-primary text-xs mb-2">
                Notes ({notes?.length || 0})
              </h3>

              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {notes?.map((note) => (
                  <div key={note._id} className="bg-gray-50 rounded p-2">
                    <div className="text-xs text-text-primary whitespace-pre-wrap break-words">
                      {note.body}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-2 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-focus resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  isLoading={addNote.isPending}
                  disabled={!noteText.trim()}
                  className="w-full"
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
