import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/ormconfig';
import { UsersModule } from '@infra/modules/users.module';
import { ServicesModule } from '@infra/modules/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    UsersModule,
    ServicesModule,
  ],
})
export class AppModule {}