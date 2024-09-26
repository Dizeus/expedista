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
import { LocalizationService } from "../localization/localization.service";
import { IUserToken } from "src/assets/types/IUserToken";
import { IUser } from "src/assets/types/IUser";
import { ITokenPayload } from "src/assets/types/ITokenPayload";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
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

  async generateToken(user: IUser): Promise<IUserToken> {
    const payload: ITokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(loginDto: LoginAuthDto): Promise<IUser> {
    const user = await this.userService.getUserByEmail(loginDto.email);
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
    const {password, ...clientUser} = user
    return clientUser;
  }
}
