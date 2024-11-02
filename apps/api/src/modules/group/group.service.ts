import { Injectable, NotFoundException } from '@nestjs/common';
import { Group } from './modeles/group.model';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { CreateGroupDto, GroupMemberCountDto, GroupMemberDto, GroupWithMembersDto, Role } from '@repo/dto';
import { User } from '../users/modeles/users.model';
import { Gift } from '../gift/modeles/gift.model';
import { GroupUsers } from './modeles/group-users.model';


@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group) private groupModel: typeof Group,
        private readonly usersService: UsersService,
        @InjectModel(GroupUsers)
        private readonly groupUsersModel: typeof GroupUsers,
    ) { }

    async createGroup(userId: number, createGroupDto: CreateGroupDto) {
        const user = await this.usersService.findById(userId)
        const group = await this.groupModel.create({ name: createGroupDto.name, ownerId: user.id });
        await group.$add('members', user.id, { through: { role: Role.OWNER } });
    }

    async getUserGroups(userId: number): Promise<GroupWithMembersDto[]> {
        return await this.usersService.getUserGroups(userId)
    }

    async getGroupsByUserId(userId: number): Promise<GroupMemberCountDto[]> {
        const groups = await this.groupModel.findAll({
            include: [
                {
                    model: User,
                    as: 'members',
                    through: { attributes: [] },
                    where: { id: userId },
                },
            ],
        });

        const groupData = await Promise.all(
            groups.map(async (group) => {
                const memberCount = await this.groupUsersModel.count({
                    where: { groupId: group.id },
                });
                return new GroupMemberCountDto({
                    id: group.id,
                    name: group.name,
                    memberCount: memberCount
                });
            })
        );
        return groupData;
    }


    async getGoupUsersInfoByGroupId(groupId: number): Promise<GroupMemberDto[]> {
        const group = await this.groupModel.findOne({
            where: { id: groupId },
            include: [
                {
                    model: User,
                    as: 'members',
                    attributes: ['id', 'name'], // Récupère uniquement l'ID et le nom
                    through: { attributes: [] }, // Exclut les colonnes de la table de jointure
                },
            ],
        });

        if (!group) {
            throw new NotFoundException(`Group with ID ${groupId} not found`);
        }


        return group.members.map((member) => {
            return new GroupMemberDto({
                userId: member.id,
                userName: member.name,
            })
        })
    };

    async getGroupWithUserAndGiftByGroupId(groupId: number) {
        const group = await this.groupModel.findByPk(groupId, {
            include: [
                { model: User, as: 'owner' },  // Propriétaire du groupe
                {
                    model: User,
                    as: 'members',
                    include: [{
                        model: Gift,
                        as: 'gifts',
                        include: [{
                            model: User,
                            as: 'buyers',
                            through: { attributes: ['status'] }  // Spécifiez les attributs de la table de jointure GiftBuyer
                        }]
                    }]
                }
            ]
        });
        if (!group) throw new NotFoundException('Group not found');

        return group
    }

    async addUserToGroup(groupId: number, userId: number, role: Role): Promise<void> {
        const group = await this.groupModel.findByPk(groupId);


        if (!group) throw new NotFoundException('Group not found');

        const user = await this.usersService.findById(userId)
        await group.$add('users', user, { through: { role } });
    }
}
