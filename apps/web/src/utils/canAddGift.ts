import { GiftDto, GroupMemberCountDto } from "@repo/dto";

interface canAddGiftEntity {
  userId: string;
  gifts: GiftDto[];
  groups: GroupMemberCountDto[];
}

export const userCanAddGift = ({ userId, gifts, groups }: canAddGiftEntity) => {
  const groupMembers = groups.reduce(
    (acc, group) => acc + (group.memberCount - 1),
    0,
  );

  return (
    gifts.filter(
      (gift) => gift.creatorId === Number(userId) && gift.buyers.length === 0,
    ).length >= groupMembers
  );
};
