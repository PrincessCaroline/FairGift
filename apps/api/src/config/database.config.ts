import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const getDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  uri: configService.get<string>('DATABASE_URL'),
  autoLoadModels: true,
  synchronize: true,
});
