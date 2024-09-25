import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { USER_ROLE } from '../../src/assets/constants/roles';
const prisma = new PrismaClient();

export default async function createTestUser() {
  const hashed = await bcrypt.hash('1234', 10);
  await prisma.user.create({
    data: {
      id: 'testUserId',
      email: 'expedistauser@gmail.com',
      fullname: 'Test User',
      role: USER_ROLE,
      password: hashed,
      avatar: null,
    },
  });

}
