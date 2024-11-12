import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

/*function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}*/

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<SequelizeModuleOptions> => {
  console.log('DATABASE_URL', process.env.DATABASE_URL);
  console.log('DATABASE_URL 2', configService.get<string>('DATABASE_URL'));
  console.log('NODE_ENV', process.env.NODE_ENV);

  //await sleep(2000); // pause de 2 secondes

  return {
    dialect: 'postgres',
    uri: configService.get<string>('DATABASE_URL'),
    autoLoadModels: true,
    synchronize: true,
  };
};
