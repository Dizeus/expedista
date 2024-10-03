import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { getToken } from '../helpers/get-token';
import { LocalizationService } from 'src/localization/localization.service';
import { ITokenPayload } from 'src/assets/types/ITokenPayload';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private localizationService: LocalizationService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const unauthorizedMessage = this.localizationService.translate(
      'translation.error.unauthorized',
    );
    try {
      const token = getToken(req.headers.authorization, unauthorizedMessage);
      const user: ITokenPayload = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: unauthorizedMessage,
      });
    }
  }
}
