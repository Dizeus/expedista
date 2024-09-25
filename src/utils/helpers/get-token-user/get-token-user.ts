import { UnauthorizedException } from "@nestjs/common";
import { IUserInfo } from "src/assets/types/IUserInfo";

export const getTokenUser = (
  req: any,
  verify: (t: string) => IUserInfo,
): IUserInfo => {
  const [bearer, token] = req.headers.authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException({
      message: `Unathorized user`,
    });
  }
  const user = verify(token);
  req.user = user;
  return user;
};
