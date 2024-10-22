import { IsString, IsNotEmpty, Matches, IsEnum } from 'class-validator';
import { UserRole } from '@domain/common/roles.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Service } from '@domain/entities/service.entity';

export class UserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Cristian',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'cristian@test.com',
  })
  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'Email must be a valid email address',
  })
  email: string;

  @ApiProperty({
    description:
      'User password. Must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character',
    example: 'Colombia2024*',
  })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  @IsEnum(UserRole, {
    message: `Role must be one of the following: ${Object.values(UserRole).join(', ')}`,
  })
  role: string;
}

export class UserUpdateDto extends PartialType(UserDto) {}
export class UserResponseDto extends UserDto {
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
    description: 'Services associated with the user',
    example: [
      {
        id: 11,
        name: 'Gardening and landscaping',
        description: 'The best environment in your home',
        cost: '60.99',
        category: 'Home',
        createdAt: '2024-10-22T14:18:58.980Z',
        updatedAt: '2024-10-22T14:19:50.076Z',
        deletedAt: null,
      },
    ],
  })
  services: Service[];
}
