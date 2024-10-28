import { Injectable } from '@nestjs/common';
import { Group } from './group.model';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './group-users.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { UsersService } from '../users/users.service';
import { GroupWithMembersDto } from './dto/groups.dto';
//import { GroupWithMembersDto } from '@fair-gift/shared';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group) private groupModel: typeof Group,
        private readonly usersService: UsersService
    ) { }

    async createGroup(userId: number, createGroupDto: CreateGroupDto) {
        const user = await this.usersService.findById(userId)
        const group = await this.groupModel.create({ name: createGroupDto.name, ownerId: user.id });
        await group.$add('users', user.id, { through: { role: 'owner' } });

        return group;
    }

    async getUserGroups(userId: number): Promise<GroupWithMembersDto[]> {
        return await this.usersService.getUserGroups(userId)
    }

    async addUserToGroup(groupId: number, userId: number, role: Role): Promise<void> {
        const group = await this.groupModel.findByPk(groupId);
        if (!group) throw new Error('Group not found');

        const user = await this.usersService.findById(userId)
        await group.$add('users', user, { through: { role } });
    }
}
