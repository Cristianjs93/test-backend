import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/entities/user.entity';
import { UserDto } from '@infra/dto/user.dto';
import { errorValidation } from 'src/utils/errorValidation';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({ relations: ['services'] });
    } catch (error) {
      errorValidation(error, 'Error fetching users');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['services'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      errorValidation(error, 'Error fetching the user');
    }
  }

  async create(createUserDto: UserDto): Promise<User> {
    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      errorValidation(error, 'Error creating user');
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.usersRepository.update(id, updateData);
      return 'User updated successfully';
    } catch (error) {
      errorValidation(error, 'Error updating user');
    }
  }

  async softDelete(id: number): Promise<string> {
    try {
      const result = await this.usersRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return 'User deleted successfully';
    } catch (error) {
      errorValidation(error, 'Error deleting user');
    }
  }

  async restore(id: number): Promise<string> {
    try {
      const result = await this.usersRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `User with ID ${id} not found or not soft deleted.`,
        );
      }
      return 'User restored successfully';
    } catch (error) {
      errorValidation(error, 'Error restoring user');
    }
  }
}
