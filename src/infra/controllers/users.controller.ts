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
import { User } from '@domain/entities/user.entity';
import { UserDto } from '@infra/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(UserRole.ADMIN)
  findAll(): Promise<User[]> {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<User> {
    try {
      return this.usersService.findOne(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  create(@Body() userData: UserDto): Promise<User> {
    try {
      return this.usersService.create(userData);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<string> {
    try {
      return this.usersService.update(Number(id), updateData);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  softDelete(@Param('id') id: string): Promise<string> {
    try {
      return this.usersService.softDelete(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  async restore(@Param('id') id: string): Promise<string> {
    try {
      return this.usersService.restore(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Post(':userId/services/:serviceId')
  @UseGuards(JwtAuthGuard)
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
