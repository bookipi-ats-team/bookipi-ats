import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  authApi,
  businessApi,
  jobsApi,
  applicationsApi,
  notesApi,
  aiApi,
} from "../api";
import type {
  User,
  Business,
  CreateBusinessInput,
  Job,
  CreateJobInput,
  UpdateJobInput,
  ApplicationWithDetails,
  UpdateApplicationInput,
  Note,
  CreateNoteInput,
  AISuggestTitlesInput,
  AISuggestMustHavesInput,
  AIGenerateJDInput,
  AISuggestionResponse,
  AIGenerateJDResponse,
  PaginatedResponse,
} from "../types";

// Auth hooks
export const useMe = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
  });
};

// Business hooks
export const useBusiness = (): UseQueryResult<Business, Error> => {
  return useQuery({
    queryKey: ["business"],
    queryFn: businessApi.getMy,
    retry: false,
  });
};

export const useCreateBusiness = (): UseMutationResult<
  Business,
  Error,
  CreateBusinessInput
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => {
      // Extract query params for prefill support
      const params = {
        name: input.name,
        description: input.description,
        industry: input.industry,
      };
      return businessApi.create(input, params);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["business"], data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useUpdateBusiness = (): UseMutationResult<
  Business,
  Error,
  { id: string; data: Partial<CreateBusinessInput> }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => businessApi.update(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["business"], data);
    },
  });
};

// Jobs hooks
export const useJobs = (params?: {
  businessId?: string;
  status?: string;
  q?: string;
}): UseQueryResult<PaginatedResponse<Job>, Error> => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => jobsApi.getAll(params),
  });
};

export const useJob = (id: string): UseQueryResult<Job, Error> => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateJob = (): UseMutationResult<
  Job,
  Error,
  CreateJobInput
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useUpdateJob = (): UseMutationResult<
  Job,
  Error,
  { id: string; data: UpdateJobInput }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => jobsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["job", data._id], data);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const usePublishJob = (): UseMutationResult<
  { status: string },
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.publish,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const usePauseJob = (): UseMutationResult<
  { status: string },
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.pause,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useCloseJob = (): UseMutationResult<
  { status: string },
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.close,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

// Applications hooks
export const useApplications = (
  jobId: string,
  params?: { stage?: string }
): UseQueryResult<PaginatedResponse<ApplicationWithDetails>, Error> => {
  return useQuery({
    queryKey: ["applications", jobId, params],
    queryFn: () => applicationsApi.getByJob(jobId, params),
    enabled: !!jobId,
  });
};

export const useApplication = (
  id: string
): UseQueryResult<ApplicationWithDetails, Error> => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationsApi.getById(id),
    enabled: !!id,
  });
};

export const useMoveApplication = (): UseMutationResult<
  ApplicationWithDetails,
  Error,
  { id: string; data: UpdateApplicationInput }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => applicationsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["application", data._id], data);
      queryClient.invalidateQueries({ queryKey: ["applications", data.jobId] });
    },
  });
};

// Notes hooks
export const useNotes = (
  applicationId: string
): UseQueryResult<Note[], Error> => {
  return useQuery({
    queryKey: ["notes", applicationId],
    queryFn: () => notesApi.getByApplication(applicationId),
    enabled: !!applicationId,
  });
};

export const useAddNote = (): UseMutationResult<
  Note,
  Error,
  { applicationId: string; data: CreateNoteInput }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, data }) =>
      notesApi.create(applicationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["application", variables.applicationId],
      });
    },
  });
};

// AI hooks
export const useAISuggestTitles = (): UseMutationResult<
  AISuggestionResponse,
  Error,
  AISuggestTitlesInput
> => {
  return useMutation({
    mutationFn: aiApi.suggestJobTitles,
  });
};

export const useAISuggestMustHaves = (): UseMutationResult<
  AISuggestionResponse,
  Error,
  AISuggestMustHavesInput
> => {
  return useMutation({
    mutationFn: aiApi.suggestMustHaves,
  });
};

export const useAIGenerateJD = (): UseMutationResult<
  AIGenerateJDResponse,
  Error,
  AIGenerateJDInput
> => {
  return useMutation({
    mutationFn: aiApi.generateJD,
  });
};
