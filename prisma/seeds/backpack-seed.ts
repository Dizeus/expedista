import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

export default async function createBackpacks() {
  const backpacks = [];
  const groups = await prisma.group.findMany();
 
  for (let group of groups) {
    const users = await prisma.user.findMany({where: {
      user_groups: {
        some: {
          group_id: group.id
        }
      }
    }});
    for(let user of users){
      backpacks.push({
        id: faker.string.uuid(),
        group_id: group.id,
        user_id: user.id,
        size: faker.number.int({ min: 40, max: 140 }),
      });
    }
  }

  return backpacks;
}
