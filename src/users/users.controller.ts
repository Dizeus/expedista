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
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { Role } from '../utils/decorators/role-auth.decorator';
import { RoleGuard } from '../utils/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //@Get()
  //getAll(
  //  @Query('page') page: number = 1,
  //  @Query('count') count: number = 10,
  //  @Query('query') query: string = '',
  //) {
  //  return this.usersService.findAll(+page, +count, query);
  //}

  //@Put('/avatar')
  //@UseGuards(JwtAuthGuard)
  //@UseInterceptors(FileInterceptor('image'))
  //setAvatar(@Req() req, @UploadedFile() image) {
  //  return this.usersService.setAvatar(image, req.user.id);
  //}

  //@Delete()
  //@UseGuards(JwtAuthGuard)
  //deleteSelf(@Req() req) {
  //  return this.usersService.remove(req.user.id);
  //}

  //@Delete(':id')
  //@UseGuards(JwtAuthGuard)
  //@Role(ADMIN_ROLE)
  //@UseGuards(RoleGuard)
  //deleteUser(@Param('id') id: string) {
  //  return this.usersService.remove(id);
  //}
}
