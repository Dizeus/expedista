import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { getTokenUser } from '../helpers/get-token-user/get-token-user';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      getTokenUser(req, (t) => this.jwtService.verify(t));
      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: `Unathorized user`,
      });
    }
  }
}
