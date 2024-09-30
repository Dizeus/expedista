import {
  Put,
  Controller,
  Get,
  UseGuards,
  Delete,
  UseInterceptors,
  Query,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IAuthRequest } from 'src/assets/types/IAuthRequest';
import { Express } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(
    @Query('page') page: number = 1,
    @Query('count') count: number = 10,
    @Query('query') query: string = '',
  ) {
    return this.usersService.findAll(+page, +count, query);
  }

  @Put('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  setAvatar(
    @Req() req: IAuthRequest,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.usersService.setAvatar(image, req.user.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteSelf(@Req() req: IAuthRequest) {
    return this.usersService.remove(req.user.id);
  }
}
