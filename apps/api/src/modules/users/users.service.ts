// src/modules/users/users.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './modeles/users.model';
import { generateToken } from 'src/shared/utils/generateToken';
import { Group } from '../group/modeles/group.model';
import { CreateUserDto, GroupWithMembersDto, MemberDto, UserDto } from '@repo/dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userModel: typeof User
    ) { }

    async createUser({ email, password, name }: CreateUserDto) {

        const existingUser = await this.findByEmail(email);

        if (existingUser) {
            // Lancer une exception si l'utilisateur existe déjà
            throw new BadRequestException('User already exists');
        }

        // Crée l'utilisateur avec un mot de passe hashé
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({ email, password: hashedPassword, name });

        return generateToken({ id: user.id, email: user.email })
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User> {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user
    }

    async getUserById(id: number): Promise<UserDto> {
        const user = await this.findById(id);

        return new UserDto({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }



    async getUserGroups(userId: number): Promise<GroupWithMembersDto[]> {
        return []
        /*  const user = await this.userModel.findByPk(userId, {
              include: [Group], // Récupère les groupes de l'utilisateur sans inclure les membres pour éviter les conflits
          });
          if (!user) throw new Error('User not found');
  
  
          const groupsWithMembers = await Promise.all(
              user.groups.map(async (group) => {
                  const members = await group.$get('users');
  
                  return new GroupWithMembersDto({
                      id: group.id,
                      name: group.name,
                      ownerId: group.ownerId,
                      createdAt: new Date(group.createdAt),
                      updatedAt: new Date(group.updatedAt),
                      members: members.map(member => new MemberDto({
                          id: member.id,
                          name: member.name,
                          email: member.email,
                      })),
                  });
              })
          );
  
          return groupsWithMembers;*/
    }

}
