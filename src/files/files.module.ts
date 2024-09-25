import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { LocalizationModule } from "../localization/localization.module";

@Module({
  imports: [LocalizationModule],
  exports: [FilesService],
  providers: [FilesService],
})
export class FilesModule {}
