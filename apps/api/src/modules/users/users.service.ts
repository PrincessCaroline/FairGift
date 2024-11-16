// src/modules/users/users.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './modeles/users.model';
import { generateToken } from 'src/shared/utils/generateToken';
import { CreateUserDto, UpdateUserDto, UserDto } from '@repo/dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser({ email, password, name }: CreateUserDto) {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      // Lancer une exception si l'utilisateur existe déjà
      throw new BadRequestException('User already exists');
    }

    // Crée l'utilisateur avec un mot de passe hashé
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    return generateToken({ id: user.id, email: user.email });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const { currentPassword, newPassword, name } = updateUserDto;

    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    if (currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Mot de passe actuel incorrect');
      }
    }

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) {
      user.name = name;
    }

    await user.save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.findById(id);

    return new UserDto({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}
