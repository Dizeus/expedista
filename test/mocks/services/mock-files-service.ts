export const mockFileService = {
  createFile: jest.fn((image: Express.Multer.File, id: string) => "filename.jpg"),
};