import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';
import { UsersService } from '@infra/services/users.service';
import { User } from '@domain/entities/user.entity';
import { UserDto } from '@infra/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
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
  softDelete(@Param('id') id: string): Promise<string> {
    try {
      return this.usersService.softDelete(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<string> {
    try {
      return this.usersService.restore(Number(id));
    } catch (error) {
      throw error;
    }
  }
}
