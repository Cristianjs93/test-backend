import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'User email',
    example: 'cristian@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Colombia2024*',
  })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT token',
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkNyaXN0aWFuIiwiZW1haWwiOiJjcmlzdGlhbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyOTU5Mzk0MSwiZXhwIjoxNzI5NTk3NTQxfQ.ZutCgBPqoPbAl2SGU_imsoQWOhDAtj6EbnvxKenr1pg',
    },
  })
  token: string;
}
