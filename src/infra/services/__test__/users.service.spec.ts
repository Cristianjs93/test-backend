/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@domain/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '@domain/common/roles.enum';
import { ServicesService } from '../services.service';
import { REQUEST } from '@nestjs/core';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  const mockServicesService = {
    getServiceOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
        {
          provide: REQUEST,
          useValue: { user: { id: 1, role: UserRole.USER } },
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockUsersRepository.find.mockRejectedValue(Error('Database Error'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUsersRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return all users', async () => {
      const result = [
        { id: 1, name: 'Cristian', email: 'cristian@example.com' },
      ];
      mockUsersRepository.find.mockResolvedValue(result);
      await expect(service.findAll()).resolves.toEqual(result);
      expect(mockUsersRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockUsersRepository.findOne.mockRejectedValue(Error('Database Error'));
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ id: 2 });
      await expect(service.findOne(2)).rejects.toThrow(ForbiddenException);
    });

    it('should return a user by ID', async () => {
      const result = { id: 1, name: 'Cristian', email: 'cristian@example.com' };
      mockUsersRepository.findOne.mockResolvedValue(result);
      await expect(service.findOne(1)).resolves.toEqual(result);
      expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw a InternalServerErrorException', async () => {
      const newUser = {
        name: 'Cristian',
        email: 'cristian@example.com',
        password: 'Colombia2024*',
        role: UserRole.ADMIN,
      };
      mockUsersRepository.create.mockResolvedValue(new User());
      mockUsersRepository.save.mockRejectedValue(Error('Database Error'));
      await expect(service.create(newUser)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should create a user', async () => {
      const newUser = {
        name: 'Cristian',
        email: 'cristian@example.com',
        password: 'Colombia2024*',
        role: UserRole.ADMIN,
      };
      const savedUser = new User();
      savedUser.password = 'hashedPassword123';
      mockUsersRepository.create.mockReturnValue(newUser);
      mockUsersRepository.save.mockResolvedValue(savedUser);
      await expect(service.create(newUser)).resolves.toBeInstanceOf(User);
      expect(mockUsersRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should throw a InternalServerErrorException', async () => {
      const updateData = { name: 'Cristian' };
      mockUsersRepository.update.mockRejectedValue(Error('Database Error'));
      await expect(service.update(1, updateData)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw a ForbiddenException', async () => {
      const updateData = { name: 'Cristian' };
      await expect(service.update(2, updateData)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should update a user', async () => {
      const updateData = { name: 'Cristian' };
      const result = 'User updated successfully';
      mockUsersRepository.findOne.mockResolvedValue(new User());
      mockUsersRepository.update.mockResolvedValue(new User());
      await expect(service.update(1, updateData)).resolves.toEqual(result);
      expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('softDelete', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockUsersRepository.softDelete.mockRejectedValue(Error('Database Error'));
      await expect(service.softDelete(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUsersRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', async () => {
      mockUsersRepository.softDelete.mockResolvedValue({ affected: 0 });
      await expect(service.softDelete(1)).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(ForbiddenException);
    });

    it('should soft delete a user', async () => {
      const result = 'User deleted successfully';
      mockUsersRepository.softDelete.mockResolvedValue({ affected: 1 });
      await expect(service.softDelete(1)).resolves.toEqual(result);
      expect(mockUsersRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('restore', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockUsersRepository.restore.mockRejectedValue(Error('Database Error'));
      await expect(service.restore(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockUsersRepository.restore).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', async () => {
      mockUsersRepository.restore.mockResolvedValue({ affected: 0 });
      await expect(service.restore(1)).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.restore).toHaveBeenCalledTimes(1);
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(ForbiddenException);
    });

    it('should restore a user', async () => {
      const result = 'User restored successfully';
      mockUsersRepository.restore.mockResolvedValue({ affected: 1 });
      await expect(service.restore(1)).resolves.toEqual(result);
      expect(mockUsersRepository.restore).toHaveBeenCalledTimes(1);
    });
  });

  describe('assignService', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ id: 1 });
      mockUsersRepository.save.mockRejectedValue(Error('Database Error'));
      await expect(service.assignService(1, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.assignService(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      await expect(service.assignService(2, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw a ForbiddenException', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ services: [{ id: 1 }] });
      mockServicesService.getServiceOrThrow.mockResolvedValue({
        id: 1,
        name: 'Amazing',
      });
      await expect(service.assignService(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should assign services to a user', async () => {
      const result = 'Amazing service has been assigned to user services';
      mockUsersRepository.findOne.mockResolvedValue({
        services: [{ id: 2 }, { id: 3 }],
      });
      mockServicesService.getServiceOrThrow.mockResolvedValue({
        id: 1,
        name: 'Amazing',
      });
      mockUsersRepository.save.mockResolvedValue(new User());
      await expect(service.assignService(1, 1)).resolves.toEqual(result);
    });
  });

  describe('removeService', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ id: 1 });
      mockUsersRepository.save.mockRejectedValue(Error('Database Error'));
      await expect(service.removeService(1, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.removeService(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ services: [2] });
      await expect(service.removeService(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should remove service from user', async () => {
      const result = 'Amazing service has been removed from user services';
      mockUsersRepository.findOne.mockResolvedValue({
        services: [{ id: 1 }, { id: 2 }],
      });
      mockServicesService.getServiceOrThrow.mockResolvedValue({
        id: 1,
        name: 'Amazing',
      });
      mockUsersRepository.save.mockResolvedValue(new User());
      await expect(service.removeService(1, 1)).resolves.toEqual(result);
    });
  });
});
