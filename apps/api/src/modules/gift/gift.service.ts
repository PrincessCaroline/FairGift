import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Gift } from './modeles/gift.model';
import { GiftBuyer } from './modeles/gift-buyer.model';
import { BuyerDto, CreateGiftDto, GiftDto, GroupUsersGiftDto, PurchaseStatus } from '@repo/dto';
import { User } from '../users/modeles/users.model';
import { GroupService } from '../group/group.service';

@Injectable()
export class GiftService {
    constructor(
        @InjectModel(Gift)
        private readonly giftModel: typeof Gift,
        @InjectModel(GiftBuyer)
        private readonly giftBuyerModel: typeof GiftBuyer,
        private readonly groupService: GroupService
    ) { }

    async createGift(userId: number, createGiftDto: CreateGiftDto): Promise<void> {
        const { name, ownerId, description, purchaseLink } = createGiftDto;

        await this.giftModel.create({
            name,
            ownerId,
            description,
            purchaseLink,
            creatorId: userId,
        });
    }

    async getUserGifts(userId: number): Promise<GiftDto[]> {
        const gifts = await this.giftModel.findAll({
            where: { ownerId: userId },
            include: [{
                model: User,
                as: 'buyers',
                through: { attributes: ['status'] }  // Spécifiez les attributs de la table de jointure GiftBuyer
            }]
        });

        console.log("gifts", JSON.stringify(gifts, null, 4))

        return gifts.map((gift) => new GiftDto({
            id: gift.id,
            name: gift.name,
            description: gift.description ?? "",
            purchaseLink: gift.purchaseLink ?? "",
            ownerId: gift.ownerId,
            createdAt: gift.createdAt,
            updatedAt: gift.updatedAt,
            buyers: gift.buyers.map((buyer) => new BuyerDto({
                userId: buyer.id,
                name: buyer.name,
                status: (buyer as any).GiftBuyer.status
            })),
        }));
    }

    async deleteGift(userId: number, giftId: number,): Promise<void> {
        const gift = await this.giftModel.findOne({ where: { id: giftId, ownerId: userId } });
        if (!gift) {
            throw new NotFoundException('Gift not found');
        }
        await gift.destroy();
    }

    async buyGift(userId: number, giftId: number,): Promise<void> {
        const gift = await this.giftModel.findByPk(giftId);
        if (!gift) {
            throw new NotFoundException('Gift not found');
        }

        let giftBuyer = await this.giftBuyerModel.findOne({ where: { giftId, userId } });
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



    async getGroupUsersGifts(userId: number, groupId: number): Promise<GroupUsersGiftDto[]> {
        const group = await this.groupService.getGroupWithUserAndGiftByGroupId(groupId)

        const giftsPerUser = group.members.map((member) => {
            const userGifts = member.gifts.filter((gift) => gift.buyers.some((buyer) => buyer.id === userId))
                .map((gift) => {
                    const giftBuyers = gift.buyers.map((buyer) => new BuyerDto({
                        userId: buyer.id,
                        name: buyer.name,
                        status: (buyer as any).GiftBuyer.status
                    }));

                    return new GiftDto({
                        id: gift.id,
                        name: gift.name,
                        description: gift.description,
                        ownerId: gift.ownerId,
                        createdAt: gift.createdAt,
                        updatedAt: gift.updatedAt,
                        buyers: giftBuyers
                    });
                });

            return new GroupUsersGiftDto({
                userId: member.id,
                groupId: group.id,
                userName: member.name,
                gifts: userGifts
            });
        });

        return giftsPerUser.filter(gift => gift.userId !== userId);
    }
}
