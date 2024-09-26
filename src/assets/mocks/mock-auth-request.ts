import { USER_ROLE } from "src/assets/constants/roles";
import { IAuthRequest } from "src/assets/types/IAuthRequest";

export const mockAuthRequest: IAuthRequest = {
  user: {
    id: 'userId',
    email: 'test@gmail.com',
    role: USER_ROLE,
  },
} as IAuthRequest;
