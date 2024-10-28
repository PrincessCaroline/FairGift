import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Group } from '../group/group.model';
import { GroupUsers } from '../group/group-users.model';

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

    @BelongsToMany(() => Group, () => GroupUsers)
    groups: Group[];
}