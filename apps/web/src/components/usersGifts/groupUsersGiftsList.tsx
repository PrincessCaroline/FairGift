import { useGroupUsersGifts } from "@/hooks/useGift";
import {
  StarIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import { GiftDto, GroupUsersGiftDto } from "@repo/dto";
import { useRouter } from "next/navigation";

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
              <div
                key={gift.id}
                className={`flex items-center justify-between px-4 py-2 rounded-full bg-purple-500`}
                onClick={() =>
                  router.push(`/gifts/${groupIdSelected}/${gift.id}`)
                }
              >
                <div className="flex items-center text-white">
                  <StarIcon className="w-5 h-5 mr-2" />
                  <span className="capitalize">{gift.name}</span>
                </div>
                {gift.purchaseLink && (
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 cursor-pointer" />
                )}
              </div>
            ))}
          </div>

          <button
            disabled={!canPickGift}
            className="mt-6 flex items-center justify-between px-4 py-2 rounded-full bg-gray-400 w-full"
            onClick={() => handleViewUserClick(userGift.userId)}
          >
            <div className="flex items-center text-white">
              <PlusIcon className="w-5 h-5 mr-2" />
              <span> Ajouter un cadeau</span>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
