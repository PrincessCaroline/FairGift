"use client";

import { useEffect, useState } from "react";
import HeaderGeneric from "@/components/ui/headerGeneric";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useMyGifts } from "@/hooks/useGift";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProgressBar from "@/components/dashboard/progresseBar";
import { useGroups } from "@/hooks/useGroup";
import GiftCardSimple from "@/components/gift/giftCardSimple";
import GenericButton from "@/components/ui/genericButton";
import LoadingPage from "@/components/ui/loading";
import WarningHeader, { WarningType } from "@/components/ui/warningHeader";

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
    return <LoadingPage />;

  const goalGifts = groups
    ? groups.reduce((acc, group) => acc + (group.memberCount - 1), 0)
    : 0;
  const canPickGift = (gifts?.length ?? 0) >= goalGifts;

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Mes cadeaux" />
      {(giftsIsError || userIsError || isGroupsError) ?? (
        <WarningHeader
          text="Une erreur est survenue lors du chargement des cadeaux."
          type={WarningType.ERROR}
        />
      )}
      <div className="min-h-screen">
        {!canPickGift && (
          <ProgressBar totalGifts={gifts?.length ?? 0} goalGifts={goalGifts} />
        )}
        <div className="flex flex-col items-center p-4">
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
        </div>
      </div>

      <div className="bg-white w-full max-w-md px-6 py-4 mx-auto sticky bottom-0">
        <GenericButton
          text="Ajouter un cadeau"
          Icon={PlusCircleIcon}
          onClick={handleAddGift}
          className="mt-6"
        />
      </div>
    </div>
  );
}
