import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateApplication } from "../hooks";
import { Button } from "../components/shared/Button";

export const AddApplicantPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const createApplication = useCreateApplication();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isProcessingCV, setIsProcessingCV] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
      // Mock auto-fill from CV
      setIsProcessingCV(true);
      setTimeout(() => {
        setFormData({
          name: "Aldo Cascon", // Mock data
          email: "aldo@bookipi.com",
          phone: "+639123456789",
          location: "Makati, Metro Manila",
        });
        setIsProcessingCV(false);
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    try {
      const newApplication = await createApplication.mutateAsync({
        jobId,
        applicant: {
          email: formData.email,
          name: formData.name,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
        },
        // In production, you would upload the CV and get a fileId
        // resumeFileId: uploadedFileId,
      });
      // Redirect to pipeline with the new applicant selected
      navigate(`/jobs/${jobId}/pipeline?applicant=${newApplication._id}`);
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="mb-4"
          >
            ← Back to Job
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Add Applicant</h1>
          <p className="text-gray-600 mt-2">
            Upload a CV or manually enter applicant information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          {/* CV Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CV (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {cvFile ? (
                <div>
                  <p className="text-green-600 font-medium mb-2">
                    ✓ {cvFile.name}
                  </p>
                  {isProcessingCV && (
                    <p className="text-blue-600 text-sm">
                      Processing CV and auto-filling fields...
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drop your CV here or click to browse
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Applicant Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Applicant Information
            </h2>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/jobs/${jobId}`)}
              disabled={createApplication.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createApplication.isPending || isProcessingCV}
            >
              {createApplication.isPending ? "Adding..." : "Add Applicant"}
            </Button>
          </div>

          {/* Error Message */}
          {createApplication.isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                Failed to add applicant. Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
