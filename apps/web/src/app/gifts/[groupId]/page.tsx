"use client";

import { useEffect, useState } from "react";
import HeaderGeneric from "@/components/ui/headerGeneric";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useMyGifts } from "@/hooks/useGift";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProgressBar from "@/components/dashboard/progresseBar";
import { useGroups } from "@/hooks/useGroup";
import GiftCardSimple from "@/components/gift/giftCardSimple";
import GenericButton from "@/components/ui/genericButton";

export default function GiftListPage() {
  const router = useRouter();
  const {
    data: gifts,
    isLoading: giftsIsLoading,
    isError: giftsIsError,
  } = useMyGifts();
  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useUserProfile();
  const {
    data: groups,
    isLoading: isGroupsLoading,
    isError: isGroupsError,
  } = useGroups();
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const id = pathSegments[2];
    setGroupId(id);
  }, []);

  const handleAddGift = () => {
    if (groupId && user) {
      router.push(`/gifts/${groupId}/create/${user.id}`);
    }
  };

  if (giftsIsLoading || userIsLoading || isGroupsLoading)
    return <p>Chargement des cadeaux...</p>;
  if (giftsIsError || userIsError || isGroupsError)
    return <p>Une erreur est survenue lors du chargement des cadeaux.</p>;

  const goalGifts = groups
    ? groups.reduce((acc, group) => acc + (group.memberCount - 1), 0)
    : 0;
  const canPickGift = (gifts?.length ?? 0) >= goalGifts;

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Mes cadeaux" />

      <div className="min-h-screen bg-white ">
        {!canPickGift && (
          <ProgressBar totalGifts={gifts?.length ?? 0} goalGifts={goalGifts} />
        )}
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-md space-y-4">
            {gifts?.map((gift) => (
              <div key={gift.id}>
                <GiftCardSimple
                  gift={gift}
                  groupId={Number(groupId)}
                  userId={gift.ownerId}
                />
              </div>
            ))}
          </div>

          <GenericButton
            text="Ajouter un cadeau"
            Icon={PlusIcon}
            onClick={handleAddGift}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  );
}
