import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GiftService } from './gift.service';
import { AuthUser } from '../auth/auth.decorator';
import { UserAuth } from '../auth/auth.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CreateGiftDto, UpdateGiftDto } from '@repo/dto';

@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createGift(
    @AuthUser() user: UserAuth,
    @Body() createGiftDto: CreateGiftDto,
  ) {
    return this.giftService.createGift(Number(user.id), createGiftDto);
  }

  @Post(':id/buy')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async buyGift(@AuthUser() user: UserAuth, @Param('id') giftId: number) {
    await this.giftService.buyGift(Number(user.id), giftId);
    return { message: 'Gift purchased successfully' };
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateGift(
    @Param('id') giftId: number,
    @Body() updateGiftDto: UpdateGiftDto,
  ) {
    await this.giftService.updateGift(giftId, updateGiftDto);
    return { message: 'Gift updated successfully' };
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  async getUserGifts(@Param('userId') userId: number) {
    return this.giftService.getUserGifts(Number(userId), false);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMyGifts(@AuthUser() user: UserAuth) {
    return this.giftService.getUserGifts(Number(user.id), true);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getGift(@Param('id') giftId: number) {
    return this.giftService.getGift(giftId);
  }

  @Get('group/:groupId')
  @UseGuards(AuthGuard)
  async getGroupUsersGifts(
    @AuthUser() user: UserAuth,
    @Param('groupId') groupId: number,
  ) {
    return this.giftService.getGroupUsersGifts(Number(user.id), groupId);
  }

  @Delete('cancelBuyGif/:id')
  @UseGuards(AuthGuard)
  async cancelBuyGift(@AuthUser() user: UserAuth, @Param('id') giftId: number) {
    await this.giftService.cancelBuyGift(giftId, Number(user.id));
    return { message: 'Gift purchase cancelled successfully' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteGift(@AuthUser() user: UserAuth, @Param('id') giftId: number) {
    await this.giftService.deleteGift(Number(user.id), giftId);
    return { message: 'Gift deleted successfully' };
  }
}
