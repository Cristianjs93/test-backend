import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../domain/entities/user.entity';
import { Faker } from '@faker-js/faker';
import { UserRole } from '../../domain/common/roles.enum';
import { getRandomEnumValue } from '../../utils/helpers';
import { hashPassword } from '../../utils/hashPassword';

export const UserFactory = setSeederFactory(User, async (faker: Faker) => {
  const user = new User();
  const password = faker.internet.password({
    length: 12,
    prefix: '*',
  });
  user.name = faker.person.firstName();
  user.email = faker.internet.email();
  user.password = await hashPassword(password);
  user.role = getRandomEnumValue(UserRole);

  return user;
});
