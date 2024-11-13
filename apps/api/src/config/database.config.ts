import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<SequelizeModuleOptions> => {
  console.log('DATABASE_URL', process.env.DATABASE_URL);
  console.log('DATABASE_URL 2', configService.get<string>('DATABASE_URL'));
  console.log('NODE_ENV', process.env.NODE_ENV);

  return {
    dialect: 'postgres',
    uri: configService.get<string>('DATABASE_URL'),
    autoLoadModels: true,
    synchronize: true,
  };
};
