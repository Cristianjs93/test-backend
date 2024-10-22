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
import {
  ServiceDto,
  ServiceResponseDto,
  ServiceUpdateDto,
} from '@infra/dto/service.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('services')
@ApiTags('Services')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all services',
  })
  @ApiOkResponse({
    description: 'Get all services successfully',
    type: [ServiceDto],
  })
  findAll(): Promise<ServiceResponseDto[]> {
    try {
      return this.servicesService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single service by Id',
  })
  @ApiOkResponse({
    description: 'Get a service successfully',
    type: [ServiceResponseDto],
  })
  findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    try {
      return this.servicesService.findOne(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Creates a new service. Restricted to admin role',
  })
  @ApiCreatedResponse({
    description: 'Service created successfully',
    type: [ServiceResponseDto],
  })
  create(@Body() serviceData: ServiceDto): Promise<ServiceResponseDto> {
    try {
      return this.servicesService.create(serviceData);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Updates a service. Restricted to admin role',
  })
  @ApiOkResponse({
    description: 'Service updated successfully',
    example: 'Service updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateData: ServiceUpdateDto,
  ): Promise<string> {
    try {
      return this.servicesService.update(Number(id), updateData);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Soft delete a service. Restricted to admin role',
  })
  @ApiOkResponse({
    description: 'Service deleted successfully',
    example: 'Service deleted successfully',
  })
  softDelete(@Param('id') id: string): Promise<string> {
    try {
      return this.servicesService.softDelete(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Restores a service. Restricted to admin role',
  })
  @ApiOkResponse({
    description: 'Service restored successfully',
    example: 'Service restored successfully',
  })
  async restore(@Param('id') id: string): Promise<string> {
    try {
      return this.servicesService.restore(Number(id));
    } catch (error) {
      throw error;
    }
  }
}
