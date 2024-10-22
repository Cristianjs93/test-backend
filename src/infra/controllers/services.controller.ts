import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { ServicesService } from '@infra/services/services.service';
import { Service } from '@domain/entities/service.entity';
import { ServiceDto } from '@infra/dto/service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(): Promise<Service[]> {
    try {
      return this.servicesService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Service> {
    try {
      return this.servicesService.findOne(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  create(@Body() serviceData: ServiceDto): Promise<Service> {
    try {
      return this.servicesService.create(serviceData);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Service>,
  ): Promise<string> {
    try {
      return this.servicesService.update(Number(id), updateData);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  softDelete(@Param('id') id: string): Promise<string> {
    try {
      return this.servicesService.softDelete(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<string> {
    try {
      return this.servicesService.restore(Number(id));
    } catch (error) {
      throw error;
    }
  }
}
