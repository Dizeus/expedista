import { faker } from '@faker-js/faker';
import { USER_ROLE } from '../../src/assets/constants/roles';

export default async function createUsers() {
  const users = [];
  for (let i = 0; i < 50; i++) {
    users.push({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      fullname: faker.person.fullName(),
      password: faker.internet.password(),
      role: USER_ROLE,
      avatar: null,
    });
  }
  return users;
}
