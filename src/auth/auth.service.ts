import {
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersRepository } from "../users/users.repository";
import { LocalizationService } from "../localization/localization.service";
import { user } from "@prisma/client";
import { IUserToken } from "src/assets/types/IUserToken";

@Injectable()
export class AuthService {

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private userRepository: UsersRepository,
    private localizationService: LocalizationService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<IUserToken> {
    const user = await this.validateUser(loginAuthDto);
    return this.generateToken(user);
  }

  async registration(createUserDto: CreateUserDto): Promise<IUserToken> {
    const newUser = await this.userService.create(createUserDto);
    return this.generateToken(newUser);
  }

  async refresh(id: string): Promise<IUserToken> {
    const user = await this.userService.findOne(id);
    return this.generateToken(user);
  }

  async generateToken(user: user): Promise<IUserToken> {
    const payload = {
      email: user.email,
      id: user.id,
      fullname: user.fullname,
      role: user.role
    };
    const { password, ...clientUser } = user;
    return {
      token: this.jwtService.sign(payload),
      user: clientUser,
    };
  }

  async validateUser(loginDto: LoginAuthDto): Promise<user> {
    const user = await this.userRepository.getUserByEmail(loginDto.email);
    const isPassword =
      user && (await bcrypt.compare(loginDto.password, user.password));

    if (!user || !isPassword) {
      throw new HttpException(
        this.localizationService.translate('translation.error.auth', [
          { user: !user },
        ]),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
