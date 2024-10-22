import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ServiceCategory } from '@domain/common/categories.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from '@domain/entities/user.entity';

export class ServiceDto {
  @ApiProperty({
    description: 'Service name',
    example: 'Football Training',
  })
  @IsString()
  @IsNotEmpty({ message: 'Service name is required' })
  name: string;

  @ApiProperty({
    description: 'Service Description',
    example: 'The Football Is Good For Training And Recreational Purposes',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Service cost',
    example: 100.99,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Cost must be a valid decimal number with up to 2 decimal places',
    },
  )
  @IsNotEmpty({ message: 'Cost is required' })
  cost: number;

  @ApiProperty({
    description: 'Service cost',
    example: 'Entertainment',
  })
  @IsEnum(ServiceCategory, {
    message: `Category must be one of the following: ${Object.values(ServiceCategory).join(', ')}`,
  })
  category: string;
}

export class ServiceUpdateDto extends PartialType(ServiceDto) {}

export class ServiceResponseDto extends ServiceDto {
  @ApiProperty({
    description: 'Creation date',
    example: '2024-10-22T14:00:47.857Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-10-22T14:00:47.857Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion date',
    example: '2024-10-22T14:00:47.857Z',
  })
  deletedAt: Date;

  @ApiProperty({
    description: 'Users associated with the service',
    example: [
      {
        id: 1,
        name: 'Roberta',
      },
      {
        id: 2,
        name: 'Chad',
      },
    ],
  })
  users: User[];
}
