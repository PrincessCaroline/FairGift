import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { UserAuth } from '../auth/auth.entity';
import { AddUserToGroupDto, CreateGroupDto } from '@repo/dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createGroup(
    @AuthUser() user: UserAuth,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this.groupService.createGroup(Number(user.id), createGroupDto);
  }

  @Get('/my-groups')
  @UseGuards(AuthGuard)
  async getUserGroups(@AuthUser() user: UserAuth) {
    return this.groupService.getGroupsByUserId(Number(user.id));
  }

  @Get('/:groupId/users')
  @UseGuards(AuthGuard)
  async getGoupUsersInfoByGroupId(@Param('groupId') groupId: number) {
    return this.groupService.getGoupUsersInfoByGroupId(groupId);
  }

  @Post('/:groupId/users/:userId')
  async addUserToGroup(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
    @Body() addUserToGroupDto: AddUserToGroupDto,
  ) {
    return this.groupService.addUserToGroup(
      groupId,
      userId,
      addUserToGroupDto.role,
    );
  }
}
