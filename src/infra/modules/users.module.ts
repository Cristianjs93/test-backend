import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@domain/entities/user.entity';
import { ServicesModule } from './services.module';
import { UsersController } from '@infra/controllers/users.controller';
import { UsersService } from '@infra/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ServicesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
