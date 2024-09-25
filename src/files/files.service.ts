import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import { LocalizationService } from "../localization/localization.service";
import { IUploadedFile } from "src/assets/types/IUploadedFile";

@Injectable()
export class FilesService {
  constructor(private localizationService: LocalizationService) {}

  createFile(file: IUploadedFile, filePath: string): string {
    try {
      const fileName =
        uuid.v4() + '.' + file.originalname.split('.').reverse()[0];
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(
        this.localizationService.translate('translation.error.savingFile'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
