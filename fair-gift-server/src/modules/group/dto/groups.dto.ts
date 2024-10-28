export class MemberDto {
    id: number;
    name: string;
    email: string;

    constructor(memberDto: MemberDto) {
        Object.assign(this, memberDto);
    }
}

export class GroupWithMembersDto {
    id: number;
    name: string;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
    members: MemberDto[];

    constructor(groupWithMembersDto: GroupWithMembersDto) {
        Object.assign(this, groupWithMembersDto);
    }
}