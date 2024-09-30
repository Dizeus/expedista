import { IUploadedFile } from "src/assets/types/IUploadedFile";

export const MOCK_FILE: Express.Multer.File = {
  originalname: 'Rick.jpg',
  buffer: Buffer.from('file content'),
  mimetype: 'image',
  size: 124,
} as Express.Multer.File;