export enum PurchaseStatus {
  BUY = "BUY",
  WAITING = "WAITING",
}

export class BuyerDto {
  userId: number;
  name: string;
  status: PurchaseStatus;

  constructor(buyerDto: BuyerDto) {
    Object.assign(this, buyerDto);
  }
}

export class GiftDto {
  id: number;
  name: string;
  description?: string;
  purchaseLink?: string;
  creatorName: string;
  creatorId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  buyers: BuyerDto[];

  constructor(giftDto: GiftDto) {
    Object.assign(this, giftDto);
  }
}

export class GroupUsersGiftDto {
  userId: number;
  userName: string;
  groupId: number;
  gifts: GiftDto[];

  constructor(groupUsersGiftDto: GroupUsersGiftDto) {
    Object.assign(this, groupUsersGiftDto);
  }
}

export class CanIPickGiftDto {
  canPickGift: boolean;

  constructor(canIPickGiftDto: CanIPickGiftDto) {
    Object.assign(this, canIPickGiftDto);
  }
}
