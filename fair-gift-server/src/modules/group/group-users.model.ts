import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Group } from './group.model';

export enum Role {
    OWNER = 'owner',
    MEMBER = 'member',
}



@Table
export class GroupUsers extends Model<GroupUsers> {
    @ForeignKey(() => User)
    @Column({ field: 'userId' }) // Nom explicite de la colonne
    userId!: number;

    @ForeignKey(() => Group)
    @Column({ field: 'groupId' }) // Nom explicite de la colonne
    groupId!: number;

    @Column({
        type: DataType.ENUM(...Object.values(Role)),
        allowNull: false,
        defaultValue: Role.MEMBER,
    })
    role!: Role;
}