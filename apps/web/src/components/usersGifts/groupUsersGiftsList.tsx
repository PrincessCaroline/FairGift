import { useGroupUsersGifts } from "@/hooks/useGift";
import { PlusIcon } from "@heroicons/react/24/solid";
import { GiftDto, GroupUsersGiftDto } from "@repo/dto";
import { useRouter } from "next/navigation";
import GiftCardSimple from "../gift/giftCardSimple";
import GenericButton from "../ui/genericButton";

type GroupUsersGiftsListProps = {
  groupIdSelected: number;
  canPickGift: boolean;
};

export default function GroupUsersGiftsList({
  groupIdSelected,
  canPickGift,
}: GroupUsersGiftsListProps) {
  const router = useRouter();
  const {
    data: groupGifts,
    isLoading,
    isError,
  } = useGroupUsersGifts(groupIdSelected);

  const handleViewUserClick = (userId: number) => {
    if (canPickGift)
      router.push(`/user/${userId}?groupId=${groupIdSelected}`);
  };

  if (isLoading) return <p>Chargement des cadeaux...</p>;
  if (isError)
    return <p>Une erreur est survenue lors du chargement des cadeaux.</p>;

  return (
    <div className="p-4 space-y-6">
      {groupGifts?.map((userGift: GroupUsersGiftDto) => (
        <div key={userGift.userId} className="p-4 bg-white shadow rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-500 rounded-full" />
            <h2 className="ml-4 text-lg font-semibold text-gray-500 capitalize">
              {userGift.userName}
            </h2>
          </div>
          <div className="space-y-2">
            {userGift.gifts.map((gift: GiftDto) => (
              <div key={gift.id}>
                <GiftCardSimple
                  gift={gift}
                  groupId={userGift.groupId}
                  userId={userGift.userId}
                />
              </div>
            ))}
          </div>



          <GenericButton
            text={
             "Ajouter un cadeau"
            }
            disabled={!canPickGift}
            Icon={PlusIcon}
            type="submit"
            onClick={() => handleViewUserClick(userGift.userId)}
            className="mt-6"
          />


        </div>
      ))}
    </div>
  );
}
