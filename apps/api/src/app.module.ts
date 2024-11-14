import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { LoginModule } from './modules/login/login.module';
import { GroupModule } from './modules/group/group.module';
import { GiftModule } from './modules/gift/gift.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
    LoginModule,
    UsersModule,
    GroupModule,
    GiftModule,
  ],
})
export class AppModule { }
