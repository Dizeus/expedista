import { user } from "@prisma/client";
import { USER_ROLE } from "../constants/roles";

export const mockUser: user = {
  id: '124Id',
  email: 'test@gmail.com',
  password: '1234',
  fullname: 'Test User',
  role: USER_ROLE,
  avatar: null,
};
