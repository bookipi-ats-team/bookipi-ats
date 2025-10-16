declare module "pdf-parse/lib/pdf-parse.js" {
  import pdfParse from "pdf-parse";

  export default pdfParse;
}

// Augment Express' Locals so `req.app.locals` is typed across the project.
declare namespace Express {
  export interface Locals {
    applicant?: IApplicant;
    business?: IBusiness;
  }
}
