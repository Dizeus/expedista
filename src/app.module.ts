import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    FilesModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/assets/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(
        process.cwd(),
        process.env.NODE_ENV === 'production'
          ? 'dist/src/assets/generated/i18n.generated.ts'
          : 'src/assets/generated/i18n.generated.ts',
      ),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
})
export class AppModule {}
