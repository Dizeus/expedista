import { PrismaClient } from '@prisma/client';
import createUsers from './users-seed';
import createTestUser from './test-user-seed';
import createGroups from './group-seed';
import createUsersGroups from './user-group-seed';
import createBackpacks from './backpack-seed';
import createItems from './item-seed';

const prisma = new PrismaClient();
const main = async () => {
  await createTestUser();

  await prisma.user.createMany({
    data: await createUsers(),
  });

  await prisma.group.createMany({
    data: await createGroups(),
  });

  await prisma.user_group.createMany({
    data: await createUsersGroups(),
  });

  await prisma.user_group.createMany({
    data: await createUsersGroups(),
  });

  await prisma.backpack.createMany({
    data: await createBackpacks(),
  });

  await prisma.item.createMany({
    data: await createItems(),
  });

};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
