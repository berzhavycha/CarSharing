export type PublicUploadedFile = {
  url: string;
  key: string | null;
  publicId: string | null;
};

export type LocalUploadedFile = {
  path: string;
  filename: string;
  mimetype: string;
};

export type UploadedFile = PublicUploadedFile | LocalUploadedFile;
