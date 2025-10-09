import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateBusiness } from '../hooks';
import { Button } from '../components/shared/Button';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createBusiness = useCreateBusiness();

  const [formData, setFormData] = useState({
    name: searchParams.get('name') || '',
    description: searchParams.get('description') || '',
    industry: searchParams.get('industry') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBusiness.mutateAsync(formData);
      navigate('/jobs');
    } catch (error) {
      console.error('Failed to create business:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Bookipi ATS</h1>
            <p className="text-text-secondary">Let's set up your business profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all resize-none"
                placeholder="Tell us about your business..."
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-text-primary mb-1.5">
                Industry
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary transition-all"
              >
                <option value="">Select an industry</option>
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {createBusiness.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                Failed to create business. Please try again.
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={createBusiness.isPending}
              className="w-full"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
