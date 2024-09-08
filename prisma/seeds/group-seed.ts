import { faker } from '@faker-js/faker';

export default async function createGroups() {
  const groups = [];
  for (let i = 0; i < 6; i++) {
    groups.push({
      id: faker.string.uuid(),
      name: faker.location.city(),
    });
  }
  return groups;
}
