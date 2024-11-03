import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../../users/modeles/users.model';
import { GroupUsers } from './group-users.model';

@Table
export class Group extends Model<Group> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerId: number;

  // Relation avec un alias explicite pour le propriétaire
  @BelongsTo(() => User, { as: 'owner' })
  owner: User;

  @BelongsToMany(() => User, {
    through: () => GroupUsers,
    as: 'members',
  })
  members: User[];
}
