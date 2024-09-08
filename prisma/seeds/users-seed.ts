import { faker } from '@faker-js/faker';

export default async function createUsers() {
  const users = [];
  for (let i = 0; i < 50; i++) {
    users.push({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      password: faker.internet.password(),
      avatar: null,
    });
  }
  return users;
}
