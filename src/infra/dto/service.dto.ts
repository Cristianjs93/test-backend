import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ServiceCategory } from '@domain/common/categories.enum';

export class ServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'Service name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Cost is required' })
  cost: number;

  @IsEnum(ServiceCategory, {
    message: `Category must be one of the following: ${Object.values(ServiceCategory).join(', ')}`,
  })
  category: ServiceCategory;
}

export class ServiceResponseDto {
  name: string;
  description: string;
  cost: number;
  category: ServiceCategory;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  users: [];
}
