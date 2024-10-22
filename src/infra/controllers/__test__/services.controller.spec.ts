/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from '../services.controller';
import { ServicesService } from '@infra/services/services.service';
import { ServiceCategory } from '@domain/common/categories.enum';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ServicesController', () => {
  let servicesController: ServicesController;
  let servicesService: ServicesService;

  const mockServicesService = {
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
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    }).compile();

    servicesController = module.get<ServicesController>(ServicesController);
    servicesService = module.get<ServicesService>(ServicesService);
  });

  describe('findAll', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockServicesService.findAll.mockRejectedValue(
        new InternalServerErrorException('Error fetching services'),
      );
      await expect(servicesController.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return all services', async () => {
      const result = [
        {
          id: 1,
          name: 'Amazing',
          description: 'description',
          cost: 100,
          category: ServiceCategory.ENTERTAINMENT,
        },
      ];
      mockServicesService.findAll.mockResolvedValue(result);
      await expect(servicesController.findAll()).resolves.toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockServicesService.findOne.mockRejectedValue(
        new InternalServerErrorException('Error fetching the service'),
      );
      await expect(servicesController.findOne('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockServicesService.findOne.mockRejectedValue(
        new NotFoundException(`Service with ID ${id} not found`),
      );
      await expect(servicesController.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a service by ID', async () => {
      const result = {
        id: 1,
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      mockServicesService.findOne.mockResolvedValue(result);
      await expect(servicesController.findOne('1')).resolves.toEqual(result);
    });
  });

  describe('create', () => {
    it('should throw a InternalServerErrorException ', async () => {
      const newService = {
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      mockServicesService.create.mockRejectedValue(
        new InternalServerErrorException('Error creating service'),
      );
      await expect(servicesController.create(newService)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should create a service', async () => {
      const newService = {
        name: 'Amazing',
        description: 'description',
        cost: 100,
        category: ServiceCategory.ENTERTAINMENT,
      };
      const result = { id: 1, ...newService };
      mockServicesService.create.mockResolvedValue(result);
      expect(await servicesController.create(newService)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should throw a InternalServerErrorException ', async () => {
      const updateData = { name: 'Amazing' };
      mockServicesService.update.mockRejectedValue(
        new InternalServerErrorException('Error updating service'),
      );
      await expect(servicesController.update('1', updateData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      const updateData = { name: 'Amazing' };
      mockServicesService.update.mockRejectedValue(
        new NotFoundException(`Service with ID ${id} not found`),
      );
      await expect(servicesController.update(id, updateData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update a service', async () => {
      const updateData = { name: 'Amazing' };
      const result = { id: 1, name: 'Amazing', description: 'description' };
      mockServicesService.update.mockResolvedValue(result);
      await expect(servicesController.update('1', updateData)).resolves.toEqual(
        result,
      );
    });
  });

  describe('softDelete', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockServicesService.softDelete.mockRejectedValue(
        new InternalServerErrorException('Error deleting service'),
      );
      await expect(servicesController.softDelete('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockServicesService.softDelete.mockRejectedValue(
        new NotFoundException(`Service with ID ${id} not found`),
      );
      await expect(servicesController.softDelete(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should soft delete a service', async () => {
      const result = 'Service deleted successfully';
      mockServicesService.softDelete.mockResolvedValue(result);
      await expect(servicesController.softDelete('1')).resolves.toEqual(result);
    });
  });

  describe('restore', () => {
    it('should throw a InternalServerErrorException ', async () => {
      mockServicesService.restore.mockRejectedValue(
        new InternalServerErrorException('Error restoring service'),
      );
      await expect(servicesController.restore('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw a NotFoundException', async () => {
      const id = '100';
      mockServicesService.restore.mockRejectedValue(
        new NotFoundException(
          `Service with ID ${id} not found or not soft deleted`,
        ),
      );
      await expect(servicesController.restore(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should restore a service', async () => {
      const result = 'Service restored successfully';
      mockServicesService.restore.mockResolvedValue(result);
      await expect(servicesController.restore('1')).resolves.toEqual(result);
    });
  });
});
