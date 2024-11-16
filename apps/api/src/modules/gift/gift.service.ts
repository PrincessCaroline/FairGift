import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Gift } from './modeles/gift.model';
import { GiftBuyer } from './modeles/gift-buyer.model';
import {
  BuyerDto,
  CreateGiftDto,
  GiftDto,
  GroupUsersGiftDto,
  PurchaseStatus,
  UpdateGiftDto,
} from '@repo/dto';
import { User } from '../users/modeles/users.model';
import { GroupService } from '../group/group.service';
import { Op } from 'sequelize';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift)
    private readonly giftModel: typeof Gift,
    @InjectModel(GiftBuyer)
    private readonly giftBuyerModel: typeof GiftBuyer,
    private readonly groupService: GroupService,
  ) {}

  async createGift(
    userId: number,
    createGiftDto: CreateGiftDto,
  ): Promise<void> {
    const { name, ownerId, description, purchaseLink } = createGiftDto;

    await this.giftModel.create({
      name,
      ownerId,
      description,
      purchaseLink,
      creatorId: userId,
    });
  }

  async updateGift(
    giftId: number,
    updateGiftDto: UpdateGiftDto,
  ): Promise<void> {
    const { description, purchaseLink } = updateGiftDto;

    await this.giftModel.update(
      { description, purchaseLink },
      { where: { id: giftId } },
    );
  }

  async getGift(giftId: number): Promise<GiftDto> {
    const gift = await this.giftModel.findByPk(giftId, {
      include: [{ association: 'creator' }, { association: 'buyers' }],
    });

    if (!gift) {
      throw new NotFoundException('Gift not found');
    }
    return new GiftDto({
      id: gift.id,
      name: gift.name,
      description: gift.description ?? '',
      purchaseLink: gift.purchaseLink ?? '',
      ownerId: gift.ownerId,
      creatorName: gift.creator.name,
      creatorId: gift.creator.id,
      createdAt: gift.createdAt,
      updatedAt: gift.updatedAt,
      buyers: gift.buyers.map(
        (buyer) =>
          new BuyerDto({
            userId: buyer.id,
            name: buyer.name,
            status: (buyer as any).GiftBuyer.status,
          }),
      ),
    });
  }

  async getUserGifts(userId: number, isMe: boolean): Promise<GiftDto[]> {
    const gifts = await this.giftModel.findAll({
      where: !isMe
        ? { ownerId: userId }
        : {
            [Op.and]: [{ creatorId: userId }, { ownerId: userId }],
          },
      include: [
        {
          model: User,
          as: 'buyers',
          through: { attributes: ['status'] },
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name'],
        },
      ],
    });

    return gifts.map(
      (gift) =>
        new GiftDto({
          id: gift.id,
          name: gift.name,
          description: gift.description ?? '',
          purchaseLink: gift.purchaseLink ?? '',
          ownerId: gift.ownerId,
          creatorName: gift.creator.name,
          creatorId: gift.creator.id,
          createdAt: gift.createdAt,
          updatedAt: gift.updatedAt,
          buyers: !isMe
            ? gift.buyers.map(
                (buyer) =>
                  new BuyerDto({
                    userId: buyer.id,
                    name: buyer.name,
                    status: (buyer as any).GiftBuyer.status,
                  }),
              )
            : [],
        }),
    );
  }

  async deleteGift(userId: number, giftId: number): Promise<void> {
    const gift = await this.giftModel.findOne({
      where: { id: giftId, creatorId: userId },
    });
    if (!gift) {
      throw new NotFoundException('Gift not found');
    }
    await gift.destroy();
  }

  async buyGift(userId: number, giftId: number): Promise<void> {
    const gift = await this.giftModel.findByPk(giftId);
    if (!gift) {
      throw new NotFoundException('Gift not found');
    }

    let giftBuyer = await this.giftBuyerModel.findOne({
      where: { giftId, userId },
    });
    if (giftBuyer) {
      giftBuyer.status = PurchaseStatus.BUY;
    } else {
      giftBuyer = await this.giftBuyerModel.create({
        giftId,
        userId,
        status: PurchaseStatus.WAITING,
      });
    }

    await giftBuyer.save();
  }

  async cancelBuyGift(giftId: number, userId: number): Promise<void> {
    const deletedCount = await this.giftBuyerModel.destroy({
      where: {
        giftId: giftId,
        userId: userId,
      },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(
        'GiftBuyer not found with the specified giftId and userId',
      );
    }
  }

  async getGroupUsersGifts(
    userId: number,
    groupId: number,
  ): Promise<GroupUsersGiftDto[]> {
    const group =
      await this.groupService.getGroupWithUserAndGiftByGroupId(groupId);

    const giftsPerUser = group.members.map((member) => {
      const userGifts = member.gifts
        .filter((gift) => gift.buyers.some((buyer) => buyer.id === userId))
        .map((gift) => {
          const giftBuyers = gift.buyers.map(
            (buyer) =>
              new BuyerDto({
                userId: buyer.id,
                name: buyer.name,
                status: (buyer as any).GiftBuyer.status,
              }),
          );

          return new GiftDto({
            id: gift.id,
            name: gift.name,
            description: gift.description,
            purchaseLink: gift.purchaseLink,
            ownerId: gift.ownerId,
            creatorName: gift.creator.name,
            creatorId: gift.creator.id,
            createdAt: gift.createdAt,
            updatedAt: gift.updatedAt,
            buyers: giftBuyers,
          });
        });

      return new GroupUsersGiftDto({
        userId: member.id,
        groupId: group.id,
        userName: member.name,
        gifts: userGifts,
      });
    });

    return giftsPerUser.filter((gift) => gift.userId !== userId);
  }
}
