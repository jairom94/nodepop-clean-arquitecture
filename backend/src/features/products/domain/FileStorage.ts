export interface StoredFile {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

export interface IFileStorage {
  save(file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<StoredFile>;
  delete(filename: string): Promise<void>;
}
