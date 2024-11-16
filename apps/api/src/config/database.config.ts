import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<SequelizeModuleOptions> => {
  return {
    dialect: 'postgres',
    uri: configService.get<string>('DATABASE_URL'),
    autoLoadModels: true,
    synchronize: true,
  };
};
