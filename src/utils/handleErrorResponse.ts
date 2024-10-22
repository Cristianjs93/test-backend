import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const allowedExceptions = [
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
];

const isAllowedException = (error: Error): boolean => {
  return allowedExceptions.some((exception) => error instanceof exception);
};

export const handleErrorResponse = (error: Error, defaultMessage: string) => {
  if (isAllowedException(error)) {
    throw error;
  }
  throw new InternalServerErrorException(defaultMessage);
};
