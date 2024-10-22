/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '@infra/services/users.service';
import { UserRole } from '@domain/common/roles.enum';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    assignService: jest.fn(),
    removeService: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersService.findAll.mockRejectedValue(
        new InternalServerErrorException('Error fetching users'),
      );
      await expect(usersController.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return all users', async () => {
      const result = [
        { id: 1, name: 'Cristian', email: 'cristian@example.com' },
      ];
      mockUsersService.findAll.mockResolvedValue(result);
      await expect(usersController.findAll()).resolves.toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new InternalServerErrorException('Error fetching the user'),
      );
      await expect(usersController.findOne('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockUsersService.findOne.mockRejectedValue(
        new NotFoundException(`User with ID ${id} not found`),
      );
      await expect(usersController.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new ForbiddenException(`You can only search your own account`),
      );
      await expect(usersController.findOne('1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return a user by ID', async () => {
      const result = { id: 1, name: 'cristian', email: 'cristian@example.com' };
      mockUsersService.findOne.mockResolvedValue(result);
      await expect(usersController.findOne('1')).resolves.toEqual(result);
    });
  });

  describe('create', () => {
    it('should throw a InternalServerErrorException ', async () => {
      const newUser = {
        name: 'Cristian',
        email: 'cristian@example.com',
        password: 'Colombia2024*',
        role: UserRole.ADMIN,
      };
      mockUsersService.create.mockRejectedValue(
        new InternalServerErrorException('Error creating user'),
      );
      await expect(usersController.create(newUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should create a user', async () => {
      const newUser = {
        name: 'Cristian',
        email: 'cristian@example.com',
        password: 'Colombia2024*',
        role: UserRole.ADMIN,
      };
      const result = { id: '1', ...newUser };
      mockUsersService.create.mockResolvedValue(result);
      expect(await usersController.create(newUser)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should throw a InternalServerErrorException ', async () => {
      const updateData = { name: 'Cristian' };
      mockUsersService.update.mockRejectedValue(
        new InternalServerErrorException('Error updating user'),
      );
      await expect(usersController.update('1', updateData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      const updateData = { name: 'Cristian' };
      mockUsersService.update.mockRejectedValue(
        new NotFoundException(`User with ID ${id} not found`),
      );
      await expect(usersController.update(id, updateData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      const updateData = { name: 'Cristian' };
      mockUsersService.update.mockRejectedValue(
        new ForbiddenException(`You can only delete your own account`),
      );
      await expect(usersController.update('1', updateData)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should update a user', async () => {
      const updateData = { name: 'Cristian' };
      const result = { id: 1, name: 'Cristian', email: 'cristian@example.com' };
      mockUsersService.update.mockResolvedValue(result);
      await expect(usersController.update('1', updateData)).resolves.toEqual(
        result,
      );
    });
  });

  describe('softDelete', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersService.softDelete.mockRejectedValue(
        new InternalServerErrorException('Error deleting user'),
      );
      await expect(usersController.softDelete('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockUsersService.softDelete.mockRejectedValue(
        new NotFoundException(`User with ID ${id} not found`),
      );
      await expect(usersController.softDelete(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersService.softDelete.mockRejectedValue(
        new ForbiddenException(`You can only delete your own account`),
      );
      await expect(usersController.softDelete('1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should soft delete a user', async () => {
      const result = 'User deleted successfully';
      mockUsersService.softDelete.mockResolvedValue(result);
      await expect(usersController.softDelete('1')).resolves.toEqual(result);
    });
  });

  describe('restore', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersService.restore.mockRejectedValue(
        new InternalServerErrorException('Error restoring user'),
      );
      await expect(usersController.restore('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockUsersService.restore.mockRejectedValue(
        new NotFoundException(
          `User with ID ${id} not found or not soft deleted`,
        ),
      );
      await expect(usersController.restore(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersService.restore.mockRejectedValue(
        new ForbiddenException(`You can only restore your own account`),
      );
      await expect(usersController.restore('1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should restore a user', async () => {
      const result = 'User restored successfully';
      mockUsersService.restore.mockResolvedValue(result);
      await expect(usersController.restore('1')).resolves.toEqual(result);
    });
  });

  describe('assignService', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersService.assignService.mockRejectedValue(
        new InternalServerErrorException('Error assigning service to user'),
      );
      await expect(usersController.assignService('1', '1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockUsersService.assignService.mockRejectedValue(
        new NotFoundException(`User with ID ${id} not found`),
      );
      await expect(usersController.assignService(id, '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersService.assignService.mockRejectedValue(
        new ForbiddenException(
          `You can only assign services to your own account`,
        ),
      );
      await expect(usersController.assignService('1', '1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersService.assignService.mockRejectedValue(
        new ForbiddenException(`Amazing service is already assigned`),
      );
      await expect(usersController.assignService('1', '1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should assign services to a user', async () => {
      const result = 'Amazing service has been assigned to user services';
      mockUsersService.assignService.mockResolvedValue(result);
      await expect(usersController.assignService('1', '1')).resolves.toEqual(
        result,
      );
    });
  });

  describe('removeService', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersService.removeService.mockRejectedValue(
        new InternalServerErrorException('Error removing service from user'),
      );
      await expect(usersController.removeService('1', '1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockUsersService.removeService.mockRejectedValue(
        new NotFoundException(`User with ID ${id} not found`),
      );
      await expect(usersController.removeService(id, '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException', async () => {
      mockUsersService.removeService.mockRejectedValue(
        new NotFoundException(
          'Amazing service is not assigned to your services',
        ),
      );
      await expect(usersController.removeService('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersService.removeService.mockRejectedValue(
        new ForbiddenException(
          `You can only remove services from your own account`,
        ),
      );
      await expect(usersController.removeService('1', '1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should remove service from user', async () => {
      const result = 'Amazing service has been removed from user services';
      mockUsersService.removeService.mockResolvedValue(result);
      await expect(usersController.removeService('1', '1')).resolves.toEqual(
        result,
      );
    });
  });
});
