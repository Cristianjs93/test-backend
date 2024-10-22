import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export const errorValidation = (
  error: typeof NotFoundException | typeof InternalServerErrorException,
  defaultMessage: string,
) => {
  if (error instanceof NotFoundException) {
    throw error;
  }
  throw new InternalServerErrorException(defaultMessage);
};
