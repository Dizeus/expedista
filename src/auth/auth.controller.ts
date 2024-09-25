import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { IAuthRequest } from 'src/assets/types/IAuthRequest';
import { IUserToken } from 'src/assets/types/IUserToken';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@Req() req: IAuthRequest): Promise<IUserToken> {
    return this.authService.refresh(req.user.id);
  }

  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto): Promise<IUserToken> {
    return this.authService.login(loginAuthDto);
  }

  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto): Promise<IUserToken> {
    return this.authService.registration(createUserDto);
  }
}
