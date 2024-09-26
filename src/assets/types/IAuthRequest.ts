import { ITokenPayload } from "./ITokenPayload";

export interface IAuthRequest extends Request {
  user: ITokenPayload;
}
