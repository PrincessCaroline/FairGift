import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './group.model';
import { GroupUsers } from './group-users.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Group, GroupUsers]),
    UsersModule
  ],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule { }
