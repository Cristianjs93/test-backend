import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { Service } from '../../domain/entities/service.entity';

export class MainSeeder implements Seeder {
  public async run(
    _: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Seeding users...');
    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(5);

    console.log('Seeding services...');
    const serviceFactory = factoryManager.get(Service);
    await serviceFactory.saveMany(20);

    console.log('Seeders executed successfully');
  }
}
