"use client";

import GiftCard from "@/components/gift/giftCard";
import GenericButton from "@/components/ui/genericButton";
import HeaderGeneric from "@/components/ui/headerGeneric";
import { useUserGifts } from "@/hooks/useGift";
import { useGroups } from "@/hooks/useGroup";
import { useUser } from "@/hooks/useUserProfile";
import { userCanAddGift } from "@/utils/canAddGift";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserGiftPage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const id = pathSegments[2];
    if (id && !isNaN(Number(id))) {
      setUserId(Number(id));
    } else {
      setUserId(null);
    }
  }, []);

  const {
    data: groups,
    isLoading: isGroupsLoading,
    isError: isGroupsError,
  } = useGroups();
  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useUser(userId);
  const {
    data: gifts,
    isLoading: giftIsLoading,
    isError: giftIsError,
  } = useUserGifts(userId);

  const handleAddGift = () => {
    router.push(`/gifts/${groupId}/create/${userId}`);
  };

  if (giftIsLoading || userIsLoading || isGroupsLoading)
    return <p>Chargement des cadeaux...</p>;
  if (giftIsError || userIsError || isGroupsError || !user || !groups)
    return <p>Erreur lors du chargement des cadeaux.</p>;

  const canAddGift = userCanAddGift({
    gifts: gifts ?? [],
    userId: user.id,
    groups,
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderGeneric name="Echanger une idée de cadeau" />

      <div className="flex-grow py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gray-500 rounded-full mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-500 capitalize">
            {user.name}
          </h1>
        </div>

        <div className="w-full max-w-md px-6 space-y-4 mx-auto">
          <p className="text-gray-500 uppercase">Disponible :</p>
          {gifts
            ?.filter((gift) => gift.buyers.length === 0)
            .sort((a, b) => {
              if (
                a.creatorId === Number(user.id) &&
                b.creatorId !== Number(user.id)
              )
                return -1;
              if (
                a.creatorId !== Number(user.id) &&
                b.creatorId === Number(user.id)
              )
                return 1;
              return 0;
            })
            .map((gift) => (
              <div key={`${gift.id}-dispo`}>
                <GiftCard
                  gift={gift}
                  groupId={Number(groupId)}
                  userId={Number(user.id)}
                  canAddGift={canAddGift}
                />
              </div>
            ))}

          {gifts &&
            gifts.filter((gift) => gift.buyers.length > 0).length > 0 && (
              <p className="text-gray-500 uppercase pt-2">Déjà pris :</p>
            )}
          {gifts
            ?.filter((gift) => gift.buyers.length > 0)
            .map((gift) => (
              <div key={`${gift.id}-not-dispo`}>
                <GiftCard
                  gift={gift}
                  groupId={Number(groupId)}
                  userId={Number(user.id)}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Bouton sticky en bas */}
      <div className="bg-white w-full max-w-md px-6 py-4 mx-auto sticky bottom-0">
        <GenericButton
              text="Ajoute ta propre idée de cadeau"
              Icon={PlusCircleIcon}
              onClick={handleAddGift}

            />
      </div>
    </div>
  );
}
