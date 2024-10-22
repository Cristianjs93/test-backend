import { UserRole } from '@domain/common/roles.enum';
import { ServiceCategory } from '@domain/common/categories.enum';

export const getRandomEnumValue = (
  values: typeof ServiceCategory | typeof UserRole,
) => {
  const enumValues = Object.values(values);
  const randomValue = enumValues[Math.floor(Math.random() * enumValues.length)];
  return randomValue;
};
