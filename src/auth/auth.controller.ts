import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { IAuthRequest } from 'src/assets/types/IAuthRequest';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@Req() req: IAuthRequest) {
    return this.authService.refresh(req.user.id);
  }

  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }
}
