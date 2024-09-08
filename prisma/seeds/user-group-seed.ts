import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

export default async function createUsersGroups() {
  const users_groups = [];
  const users = await prisma.user.findMany();
  const groups = await prisma.group.findMany();

  for (let group of groups) {
    for (let i = 0; i < 3; i++) {
      const userId = users[Math.floor(Math.random() * users.length)].id;
      users_groups.push({
        id: faker.string.uuid(),
        user_id: userId,
        group_id: group.id,
      });
    }
    users_groups.push({
      id: faker.string.uuid(),
      user_id: 'testUserId',
      group_id: group.id,
    });
  }

  return users_groups;
}
