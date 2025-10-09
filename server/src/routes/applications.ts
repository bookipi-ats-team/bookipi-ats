import { Router } from "express";
import {
  createApplication,
  getApplicationById,
  getApplicationNotes,
  getJobApplications,
  patchApplication,
  postApplicationNote,
} from "../controllers/application.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createApplicationBodySchema,
  getApplicationByIdParamsSchema,
  getApplicationNotesParamsSchema,
  getJobApplicationsParamsSchema,
  getJobApplicationsQuerySchema,
  patchApplicationBodySchema,
  patchApplicationParamsSchema,
  postApplicationNoteBodySchema,
  postApplicationNoteParamsSchema,
} from "../validation/applications.js";

const router = Router();

router.get(
  "/jobs/:jobId/applications",
  validateRequest({
    params: getJobApplicationsParamsSchema,
    query: getJobApplicationsQuerySchema,
  }),
  getJobApplications,
);

router.get(
  "/applications/:id",
  validateRequest({ params: getApplicationByIdParamsSchema }),
  getApplicationById,
);

router.post(
  "/applications",
  validateRequest({ body: createApplicationBodySchema }),
  createApplication,
);

router.patch(
  "/applications/:id",
  validateRequest({
    params: patchApplicationParamsSchema,
    body: patchApplicationBodySchema,
  }),
  patchApplication,
);

router.post(
  "/applications/:id/notes",
  validateRequest({
    params: postApplicationNoteParamsSchema,
    body: postApplicationNoteBodySchema,
  }),
  postApplicationNote,
);

router.get(
  "/applications/:id/notes",
  validateRequest({ params: getApplicationNotesParamsSchema }),
  getApplicationNotes,
);

export default router;
