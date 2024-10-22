import { IsString, IsNotEmpty, Matches, IsEnum } from 'class-validator';
import { UserRole } from '@domain/common/roles.enum';

export class UserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'Email must be a valid email address',
  })
  email: string;

  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;

  @IsEnum(UserRole, {
    message: `Role must be one of the following: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}

export class UserResponseDto {
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  services: [];
}
