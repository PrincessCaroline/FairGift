import { useGroupUsersGifts } from "@/hooks/useGift";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { GiftDto, GroupUsersGiftDto } from "@repo/dto";
import { useRouter } from "next/navigation";

import GenericButton from "../ui/genericButton";
import LoadingPage from "../ui/loading";
import WarningHeader, { WarningType } from "../ui/warningHeader";
import GiftCard from "../gift/giftCard";

type GroupUsersGiftsListProps = {
  groupIdSelected: number;
  //canPickGift: boolean;
};

export default function GroupUsersGiftsList({
  groupIdSelected,
  //canPickGift,
}: GroupUsersGiftsListProps) {
  const router = useRouter();
  const {
    data: groupGifts,
    isLoading,
    isError,
  } = useGroupUsersGifts(groupIdSelected);

  const handleViewUserClick = (userId: number) => {
    // if (canPickGift) router.push(`/user/${userId}`);
    router.push(`/user/${userId}`);
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div>
      {isError ?? (
        <WarningHeader
          text="Erreur lors du chargement des cadeaux."
          type={WarningType.ERROR}
        />
      )}
      <div className="p-4 space-y-6">
        {groupGifts?.map((userGift: GroupUsersGiftDto) => (
          <div key={userGift.userId} className="p-4 bg-white shadow rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-500 rounded-full" />
              <h2
                className="ml-4 text-lg font-semibold text-gray-500"
                style={{ textTransform: "capitalize" }}
              >
                {userGift.userName}
              </h2>
            </div>
            <div className="space-y-2">
              {userGift.gifts.map((gift: GiftDto) => (
                <div key={gift.id}>
                  <GiftCard
                    gift={gift}
                    userId={Number(userGift.userId)}
                    viewBuyers={false}
                  />
                </div>
              ))}
            </div>

            <GenericButton
              text={"Ajouter un cadeau"}
              //disabled={!canPickGift}
              Icon={PlusCircleIcon}
              type="submit"
              onClick={() => handleViewUserClick(userGift.userId)}
              className="mt-6"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
