import { UnauthorizedException } from '@nestjs/common';

export const getToken = (authHeader: string, errorMessage: string): string => {
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException({
      message: errorMessage,
    });
  }

  return token;
};
