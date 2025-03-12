import { ApiResponse, BaseModule, applicantType } from '..';

// export type docTypes =
//   | 'Gurantor Deviation'
//   | 'Sales Deviation'
//   | 'Credit Deviation'


export interface filePathDto {

  filePath?: string;
  fileName?: string
  fileType?: string
}

// export type UploadDocumentRequest = {
//   base64value: string;
//   appId: string;
//   doctype: docTypes | null;
//   applicantType: applicantType;
//   type: 'jpg' | 'pdf' | null;
//   isMandatory: 'Y' | 'N';
//   isMultiple?: 'Y' | 'N';
//   fileName?: string;
// } | null;

// export type UploadDocumentRequest = {
//   base64value: string;
//   appId: string;
//   doctype: docTypes | null;
//   applicantType: applicantType;
//   type: 'jpg' | 'pdf' | null;
//   fileName?: string;
//   empId : string,
// 	ownedBy: string,
// } | null;

export type UploadDocumentRequest = {
  base64value: string;
  appId: string;
  doctype: string;
  applicantType: applicantType;
  type: string;
  fileName?: string;
  empId : string,
	ownedBy: string,
} | null;

export type UploadDocumentResponse = {
  applicantId: string;
  detailsCheck?: boolean;
  detailsCheckMessage?: string;
} | null;

export interface DeviationDto {
  documentType: docTypes;
  appId: string,
  ownedBy: string,
  createdDate: string,
  updatedDate: string,
  empId: string,
  image1: string,
  img1_type: string,
  image2: string,
  img2_type: string,
  image3: string,
  img3_type: string,
  image4: string,
  img4_type: string,
  image5: string,
  deferalDocumentType: string;
}

export type GetDeviationDocumentsDetailResponse = {
  deviationDtoList: DeviationDto[];
  isSalesDeviation: boolean;
  isGurantorDeviation: boolean;
} | null;

export type DeviationDocumentType = BaseModule & {
  UploadDocument: (
    request: UploadDocumentRequest,
  ) => Promise<ApiResponse<UploadDocumentResponse>>;
  GetDeviationDocumentsDetail: (
    appId: string,
    applicantType: applicantType
  ) => Promise<ApiResponse<GetDeviationDocumentsDetailResponse>>;
};
