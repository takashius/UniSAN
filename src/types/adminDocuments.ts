import type { DocumentIdStatus } from ".";

export interface AdminDocument {
  _id: string;
  name?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phone?: string;
  documentId?: string;
  photo?: string | null;
  imageDocumentId?: string | null;
  imageDocumentIdStatus: DocumentIdStatus;
  imageDocumentIdRejectionReason?: string;
  date?: string;
}
