import { UserRole } from '@domain/common/roles.enum';
import { ServiceCategory } from '@domain/common/categories.enum';
import { Service } from '@domain/entities/service.entity';

export const getRandomEnumValue = (
  values: typeof ServiceCategory | typeof UserRole,
) => {
  const enumValues = Object.values(values);
  const randomValue = enumValues[Math.floor(Math.random() * enumValues.length)];
  return randomValue;
};

export const isServiceAssigned = (
  userServices: Service[],
  serviceId: number,
) => {
  return userServices.some((service) => service.id === serviceId);
};

export const findServiceIndex = (
  userServices: Service[],
  serviceId: number,
) => {
  return userServices.findIndex((service) => service.id === serviceId);
};
