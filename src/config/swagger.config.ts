import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('Test Backend')
  .setDescription('Users and Services Management')
  .setVersion('1.0.0')
  .build();
