import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '@domain/entities/service.entity';
import { ServiceDto } from '@infra/dto/service.dto';
import { errorValidation } from 'src/utils/errorValidation';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    try {
      return await this.servicesRepository.find({ relations: ['users'] });
    } catch (error) {
      errorValidation(error, 'Error fetching services');
    }
  }

  async findOne(id: number): Promise<Service> {
    try {
      const service = await this.servicesRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found.`);
      }
      return service;
    } catch (error) {
      errorValidation(error, 'Error fetching the service');
    }
  }

  async create(createServiceDto: ServiceDto): Promise<Service> {
    try {
      const service = this.servicesRepository.create(createServiceDto);
      return await this.servicesRepository.save(service);
    } catch (error) {
      errorValidation(error, 'Error creating service');
    }
  }

  async update(id: number, updateData: Partial<Service>): Promise<string> {
    try {
      const service = await this.servicesRepository.findOne({ where: { id } });
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      await this.servicesRepository.update(id, updateData);
      return 'Service updated successfully';
    } catch (error) {
      errorValidation(error, 'Error updating service');
    }
  }

  async softDelete(id: number): Promise<string> {
    try {
      const result = await this.servicesRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Service with ID ${id} not found.`);
      }
      return 'Service deleted successfully';
    } catch (error) {
      errorValidation(error, 'Error deleting service');
    }
  }

  async restore(id: number): Promise<string> {
    try {
      const result = await this.servicesRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Service with ID ${id} not found or not soft deleted.`,
        );
      }
      return 'Service restored successfully';
    } catch (error) {
      errorValidation(error, 'Error restoring service');
    }
  }
}
