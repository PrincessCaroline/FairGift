import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { UserAuth } from '../auth/auth.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group';

@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) { }

    @Post('create')
    @UseGuards(AuthGuard)
    async createGroup(@AuthUser() user: UserAuth, @Body() createGroupDto: CreateGroupDto) {
        return await this.groupService.createGroup(Number(user.id), createGroupDto);
    }

    @Get('/my-groups')
    @UseGuards(AuthGuard)
    async getUserGroups(@AuthUser() user: UserAuth,) {
        return this.groupService.getUserGroups(Number(user.id));
    }

    @Post('/:groupId/users/:userId')
    async addUserToGroup(
        @Param('groupId') groupId: number,
        @Param('userId') userId: number,
        @Body() addUserToGroupDto: AddUserToGroupDto,
    ) {
        return this.groupService.addUserToGroup(groupId, userId, addUserToGroupDto.role);
    }
}
