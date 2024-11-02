import { IsEnum } from 'class-validator';

export enum Role {
    OWNER = 'owner',
    MEMBER = 'member',
}

export class AddUserToGroupDto {
    @IsEnum(Role)
    role: Role;
}