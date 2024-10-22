import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@infra/auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '@infra/auth/guards/roles-auth.guard';
import { Roles } from '@infra/auth/decorators/roles.decorator';
import { UserRole } from '@domain/common/roles.enum';
import { ServicesService } from '@infra/services/services.service';
import { Service } from '@domain/entities/service.entity';
import { ServiceDto } from '@infra/dto/service.dto';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
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
  @Roles(UserRole.ADMIN)
  create(@Body() serviceData: ServiceDto): Promise<Service> {
    try {
      return this.servicesService.create(serviceData);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  @Roles('admin')
  softDelete(@Param('id') id: string): Promise<string> {
    try {
      return this.servicesService.softDelete(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/restore')
  @Roles(UserRole.ADMIN)
  async restore(@Param('id') id: string): Promise<string> {
    try {
      return this.servicesService.restore(Number(id));
    } catch (error) {
      throw error;
    }
  }
}
