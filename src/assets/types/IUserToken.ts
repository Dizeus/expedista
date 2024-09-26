import { ITokenPayload } from './ITokenPayload';

export interface IUserToken {
  user: ITokenPayload;
  token: string;
}