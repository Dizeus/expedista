import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { UsersRepository } from "./users.repository";
import { LocalizationModule } from "../localization/localization.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    FilesModule,
    LocalizationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
