import { user } from '@prisma/client';

export interface IUser extends Omit<user, 'password'> {}
