import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/entities/user.entity';
import { ServicesService } from './services.service';
import { UserDto, UserResponseDto, UserUpdateDto } from '@infra/dto/user.dto';
import { REQUEST } from '@nestjs/core';
import { hashPassword } from '@utils/hashPassword';
import { handleErrorResponse } from '@utils/handleErrorResponse';
import { isServiceAssigned, findServiceIndex } from '@utils/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private servicesService: ServicesService,
    @Inject(REQUEST)
    private request: any,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.usersRepository.find({
        relations: ['services'],
      });
      users.forEach((user) => {
        delete user.password;
      });
      return users;
    } catch (error) {
      handleErrorResponse(error, 'Error fetching users');
    }
  }

  async findOne(id: number): Promise<UserResponseDto> {
    try {
      this.validateIdentityMatch(id, 'search');
      const user = await this.getUserOrThrow(id);
      delete user.password;
      return user;
    } catch (error) {
      handleErrorResponse(error, 'Error fetching the user');
    }
  }

  async create(createUserDto: UserDto): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserDto);
      user.password = await hashPassword(user.password);
      return await this.usersRepository.save(user);
    } catch (error) {
      handleErrorResponse(error, 'Error creating user');
    }
  }

  async update(id: number, updateData: UserUpdateDto): Promise<string> {
    try {
      this.validateIdentityMatch(id, 'update');
      await this.usersRepository.update(id, updateData);
      return 'User updated successfully';
    } catch (error) {
      handleErrorResponse(error, 'Error updating user');
    }
  }

  async softDelete(id: number): Promise<string> {
    try {
      this.validateIdentityMatch(id, 'delete');
      const result = await this.usersRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return 'User deleted successfully';
    } catch (error) {
      handleErrorResponse(error, 'Error deleting user');
    }
  }

  async restore(id: number): Promise<string> {
    try {
      this.validateIdentityMatch(id, 'restore');
      const result = await this.usersRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `User with ID ${id} not found or not soft deleted.`,
        );
      }
      return 'User restored successfully';
    } catch (error) {
      handleErrorResponse(error, 'Error restoring user');
    }
  }

  async assignService(userId: number, serviceId: number): Promise<string> {
    try {
      this.validateIdentityMatch(userId, 'assign services to');
      const user = await this.getUserOrThrow(userId);
      const service = await this.servicesService.getServiceOrThrow(serviceId);
      if (isServiceAssigned(user.services, serviceId)) {
        throw new ForbiddenException(
          `${service.name} service is already assigned`,
        );
      }
      user.services.push(service);
      await this.usersRepository.save(user);
      return `${service.name} service has been assigned to user services`;
    } catch (error) {
      handleErrorResponse(error, 'Error assigning service to user');
    }
  }

  async removeService(userId: number, serviceId: number): Promise<string> {
    try {
      this.validateIdentityMatch(userId, 'remove services from');
      const user = await this.getUserOrThrow(userId);
      const service = await this.servicesService.getServiceOrThrow(serviceId);
      const serviceIndex = findServiceIndex(user.services, serviceId);
      if (serviceIndex === -1) {
        throw new NotFoundException(
          `${service.name} service is not assigned to your services`,
        );
      }
      user.services.splice(serviceIndex, 1);
      await this.usersRepository.save(user);
      return `${service.name} service has been removed from user services`;
    } catch (error) {
      handleErrorResponse(error, 'Error removing service from user');
    }
  }

  validateIdentityMatch(id: number, method: string): void {
    const requestUser = this.request.user;
    if (id !== requestUser.id && requestUser.role !== 'admin') {
      throw new ForbiddenException(`You can only ${method} your own account`);
    }
  }

  async getUserOrThrow(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
