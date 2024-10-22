import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthDto, AuthResponseDto } from '@infra/dto/auth.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiTags('Auth')
  @Post('login')
  @ApiOperation({
    summary: 'Login a user and generates a JWT token',
  })
  @ApiBody({
    description: 'Credentials for login',
    type: AuthDto,
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: [AuthResponseDto],
  })
  @HttpCode(200)
  async login(@Request() req): Promise<AuthResponseDto> {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw error;
    }
  }
}
