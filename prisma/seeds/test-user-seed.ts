import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export default async function createTestUser() {
  const hashed = await bcrypt.hash('1234', 10);
  await prisma.user.create({
    data: {
      id: 'testUserId',
      email: 'expedistauser@gmail.com',
      name: 'Test',
      surname: 'user',
      password: hashed,
      avatar: null,
    },
  });

}
