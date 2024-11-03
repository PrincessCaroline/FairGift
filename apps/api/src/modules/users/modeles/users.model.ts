import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Group } from '../../group/modeles/group.model';
import { GroupUsers } from '../../group/modeles/group-users.model';
import { Gift } from 'src/modules/gift/modeles/gift.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Group, { as: 'ownedGroups', foreignKey: 'ownerId' })
  ownedGroups: Group[];

  // Utiliser le même alias que dans Group
  @BelongsToMany(() => Group, {
    through: () => GroupUsers,
    as: 'members',
  })
  members: Group[];

  @HasMany(() => Gift, { as: 'gifts', foreignKey: 'ownerId' })
  gifts: Gift[];
}
