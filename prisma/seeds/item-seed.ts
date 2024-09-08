import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

export default async function createItems() {
  const items = [];
  const backpacks = await prisma.backpack.findMany();

  for (let backpack of backpacks) {
    for (let i = 0; i < 3; i++) {
      items.push({
        id: faker.string.uuid(),
        name: faker.word.noun(),
        weight: faker.number.int({ min: 10, max: 5000 }),
        volume: faker.number.int({ min: 1, max: 20 }),
        quantity: faker.number.int({ min: 1, max: 6 }),
        type: 'equipment',
        backpack_id: backpack.id,
      });
    }
  }

  return items;
}
