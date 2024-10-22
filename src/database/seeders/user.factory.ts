import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../domain/entities/user.entity';
import { Faker } from '@faker-js/faker';
import { UserRole } from '../../domain/common/roles.enum';
import { getRandomEnumValue } from '../../utils/helpers';

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.name = faker.person.firstName();
  user.email = faker.internet.email();
  user.password = faker.internet.password({
    pattern:
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
  });
  user.role = getRandomEnumValue(UserRole);

  return user;
});
