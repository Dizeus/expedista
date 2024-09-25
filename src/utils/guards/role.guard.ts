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
import { getTokenUser } from '../helpers/get-token-user/get-token-user';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
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
    const req = context.switchToHttp().getRequest();
    try {
      const user = getTokenUser(req, (t) => this.jwtService.verify(t));
      return user.role === requiredRole;
    } catch (e) {
      throw new HttpException(`Forbidden`, HttpStatus.FORBIDDEN);
    }
  }
}
