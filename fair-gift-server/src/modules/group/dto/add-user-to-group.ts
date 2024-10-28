import { IsEnum } from 'class-validator';
import { Role } from '../group-users.model';

export class AddUserToGroupDto {
    @IsEnum(Role)
    role: Role;
}