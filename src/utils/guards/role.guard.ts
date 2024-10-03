import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLE_KEY, USER_ROLE } from 'src/assets/constants/roles';
import { getToken } from '../helpers/get-token';
import { LocalizationService } from 'src/localization/localization.service';
import { ITokenPayload } from 'src/assets/types/ITokenPayload';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private localizationService: LocalizationService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRole === USER_ROLE) {
      return true;
    }
    const unauthorizedMessage = this.localizationService.translate(
      'translation.error.unauthorized',
    );
    const req = context.switchToHttp().getRequest();
    try {
      const token = getToken(req.headers.authorization, unauthorizedMessage);
      const user: ITokenPayload = this.jwtService.verify(token);
      req.user = user;
      return user.role === requiredRole;
    } catch (e) {
      throw new HttpException(
        this.localizationService.translate('translation.error.forbidden'),
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
