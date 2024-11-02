import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/modeles/users.model';
import { Group } from './group.model';
import { Role } from '@repo/dto';


@Table
export class GroupUsers extends Model<GroupUsers> {
    @ForeignKey(() => User)
    @Column({
        field: 'userId',
        type: DataType.INTEGER,
        allowNull: false,
    }) 
    userId!: number;

    @ForeignKey(() => Group)
    @Column({
        field: 'groupId',
        type: DataType.INTEGER,
        allowNull: false,
    })
    groupId!: number;

    @Column({
        type: DataType.ENUM(...Object.values(Role)),
        allowNull: false,
        defaultValue: Role.MEMBER,
    })
    role!: Role;
}