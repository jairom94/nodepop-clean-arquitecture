export interface UploadProductImageCommand {
  id: number;
  ownerId: number;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}
