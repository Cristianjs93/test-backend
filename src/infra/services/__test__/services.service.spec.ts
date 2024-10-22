/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from '../../services/services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from '@domain/entities/service.entity';
import { Repository } from 'typeorm';
import { ServiceCategory } from '@domain/common/categories.enum';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let servicesRepository: Repository<Service>;

  const mockServicesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: mockServicesRepository,
        },
      ],
    }).compile();
    service = module.get<ServicesService>(ServicesService);
    servicesRepository = module.get<Repository<Service>>(
      getRepositoryToken(Service),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockServicesRepository.find.mockRejectedValue(Error('Database Error'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockServicesRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return all services', async () => {
      const result = {
        id: 1,
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      mockServicesRepository.find.mockResolvedValue(result);
      await expect(service.findAll()).resolves.toEqual(result);
      expect(mockServicesRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockServicesRepository.findOne.mockRejectedValue(Error('Database Error'));
      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockServicesRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', async () => {
      mockServicesRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockServicesRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a service by ID', async () => {
      const result = {
        id: 1,
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      mockServicesRepository.findOne.mockResolvedValue(result);
      await expect(service.findOne(1)).resolves.toEqual(result);
      expect(mockServicesRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw a InternalServerErrorException', async () => {
      const newService = {
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      mockServicesRepository.create.mockResolvedValue(new Service());
      mockServicesRepository.save.mockRejectedValue(Error('Database Error'));
      await expect(service.create(newService)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockServicesRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should create a service', async () => {
      const newService = {
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      mockServicesRepository.create.mockResolvedValue(new Service());
      mockServicesRepository.save.mockResolvedValue(new Service());
      await expect(service.create(newService)).resolves.toBeInstanceOf(Service);
      expect(mockServicesRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should throw a InternalServerErrorException', async () => {
      const updateData = { name: 'Amazing' };
      mockServicesRepository.update.mockRejectedValue(Error('Database Error'));
      await expect(service.update(1, updateData)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockServicesRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', async () => {
      const updateData = { name: 'Amazing' };
      mockServicesRepository.findOne.mockResolvedValue(null);
      await expect(service.update(1, updateData)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockServicesRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should update a service', async () => {
      const updateData = { name: 'Amazing' };
      const result = 'Service updated successfully';
      mockServicesRepository.findOne.mockResolvedValue(new Service());
      mockServicesRepository.update.mockResolvedValue(new Service());
      await expect(service.update(1, updateData)).resolves.toEqual(result);
      expect(mockServicesRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('softDelete', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockServicesRepository.softDelete.mockRejectedValue(
        Error('Database Error'),
      );
      await expect(service.softDelete(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockServicesRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', async () => {
      mockServicesRepository.softDelete.mockResolvedValue({ affected: 0 });
      await expect(service.softDelete(1)).rejects.toThrow(NotFoundException);
      expect(mockServicesRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should soft delete a service', async () => {
      const result = 'Service deleted successfully';
      mockServicesRepository.softDelete.mockResolvedValue({ affected: 1 });
      await expect(service.softDelete(1)).resolves.toEqual(result);
      expect(mockServicesRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('restore', () => {
    it('should throw a InternalServerErrorException', async () => {
      mockServicesRepository.restore.mockRejectedValue(Error('Database Error'));
      await expect(service.restore(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockServicesRepository.restore).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException', async () => {
      mockServicesRepository.restore.mockResolvedValue({ affected: 0 });
      await expect(service.restore(1)).rejects.toThrow(NotFoundException);
      expect(mockServicesRepository.restore).toHaveBeenCalledTimes(1);
    });

    it('should restore a service', async () => {
      const result = 'Service restored successfully';
      mockServicesRepository.restore.mockResolvedValue({ affected: 1 });
      await expect(service.restore(1)).resolves.toEqual(result);
      expect(mockServicesRepository.restore).toHaveBeenCalledTimes(1);
    });
  });

  describe('getServiceOrThrow', () => {
    it('should throw a NotFoundException', async () => {
      mockServicesRepository.findOne.mockResolvedValue(null);
      await expect(service.getServiceOrThrow(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockServicesRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a service by ID', async () => {
      const result = {
        id: 1,
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      mockServicesRepository.findOne.mockResolvedValue(result);
      await expect(service.getServiceOrThrow(1)).resolves.toEqual(result);
      expect(mockServicesRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
