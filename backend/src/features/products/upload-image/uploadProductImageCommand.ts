export interface UploadProductImageCommand {
  id: number;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}
