import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@infra/auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '@infra/auth/guards/roles-auth.guard';
import { Roles } from '@infra/auth/decorators/roles.decorator';
import { UserRole } from '@domain/common/roles.enum';
import { UsersService } from '@infra/services/users.service';
import { UserDto, UserResponseDto, UserUpdateDto } from '@infra/dto/user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all users. Restricted to admin role',
  })
  @ApiOkResponse({
    description: 'Get all users successfully',
    type: [UserResponseDto],
  })
  findAll(): Promise<UserResponseDto[]> {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Get a single user by Id. Users with user role can only find their own account',
  })
  @ApiOkResponse({
    description: 'Get a user successfully',
    type: [UserResponseDto],
  })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      return this.usersService.findOne(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a new user',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: [UserResponseDto],
  })
  create(@Body() userData: UserDto): Promise<UserResponseDto> {
    try {
      return this.usersService.create(userData);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Updates a user. Users with user role can only update their own account',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    example: 'User updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateData: UserUpdateDto,
  ): Promise<string> {
    try {
      return this.usersService.update(Number(id), updateData);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Soft deletes a user. Users with user role can only delete their own account',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    example: 'User deleted successfully',
  })
  softDelete(@Param('id') id: string): Promise<string> {
    try {
      return this.usersService.softDelete(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Restores a user. Users with user role can only restore their own account',
  })
  @ApiOkResponse({
    description: 'User restored successfully',
    example: 'User restored successfully',
  })
  async restore(@Param('id') id: string): Promise<string> {
    try {
      return this.usersService.restore(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Post(':userId/services/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Assigns service to user. Users with user role can only assign services to their own account',
  })
  @ApiOkResponse({
    description: 'Service assigned successfully',
    example:
      'Gardening and landscaping service has been assigned to user services',
  })
  async assignService(
    @Param('userId') userId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<string> {
    try {
      return await this.usersService.assignService(
        Number(userId),
        Number(serviceId),
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':userId/services/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Removes service from user. Users with user role can only remove services from their own account',
  })
  @ApiOkResponse({
    description: 'Service removed successfully',
    example:
      'Gardening and landscaping service has been removed from user services',
  })
  async removeService(
    @Param('userId') userId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<string> {
    try {
      return await this.usersService.removeService(
        Number(userId),
        Number(serviceId),
      );
    } catch (error) {
      throw error;
    }
  }
}
