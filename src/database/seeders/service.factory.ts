import { setSeederFactory } from 'typeorm-extension';
import { Service } from '../../domain/entities/service.entity';
import { Faker } from '@faker-js/faker';
import { ServiceCategory } from '../../domain/common/categories.enum';
import { getRandomEnumValue } from '../../utils/helpers';

export const ServiceFactory = setSeederFactory(Service, (faker: Faker) => {
  const service = new Service();
  service.name = faker.commerce.productName();
  service.description = faker.commerce.productDescription();
  service.cost = Number(faker.commerce.price({ min: 100, max: 200 }));
  service.category = getRandomEnumValue(ServiceCategory);

  return service;
});
