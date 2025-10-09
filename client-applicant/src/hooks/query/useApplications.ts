import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/user.store'; import { api } from '@/services/api.service';
import { JobApplicationFormData } from '@/schemas/job-application-schema';
import { PublicApplicationsResponse } from '@/types/applicant.type';


// Get applications by email from public endpoint
export const getApplicationsByEmail = async (
  email: string
): Promise<PublicApplicationsResponse> => {
  return api.get<PublicApplicationsResponse>(`/public/applications/${encodeURIComponent(email)}`);
};

export const useApplications = () => {
  const { email, isAuthenticated } = useUserStore();

  return useQuery({
    queryKey: ['applications', email],
    queryFn: () => {
      if (!email) {
        throw new Error('No email provided');
      }
      return getApplicationsByEmail(email);
    },
    enabled: isAuthenticated && !!email,
  });
};