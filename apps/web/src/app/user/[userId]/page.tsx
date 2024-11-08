"use client";

import HeaderGeneric from "@/components/ui/headerGeneric";
import { useBuyGift, useUserGifts } from "@/hooks/useGift";
import { useUser } from "@/hooks/useUserProfile";
import {
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserGiftPage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const router = useRouter();
  const buyGiftMutation = useBuyGift();
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

  const handleBuyGift = (giftId: number, isBuy: boolean) => {
    if (!isBuy) {
      buyGiftMutation.mutate(giftId);
    }
  };

  const viewGift = (giftId: number) => {
    router.push(`/gifts/${groupId}/${giftId}`);
  };

  if (giftIsLoading || userIsLoading) return <p>Chargement des cadeaux...</p>;
  if (giftIsError || userIsError || !user)
    return <p>Erreur lors du chargement des cadeaux.</p>;

  // gifts?.length dispo et creator me > nombre de membre -1

  return (
    <div className="min-h-screen bg-white pb-5">
      <HeaderGeneric name="Echanger une idée de cadeau" />
      <div className="py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gray-500 rounded-full mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-500 capitalize">
            {user?.name}
          </h1>
        </div>

        <div className="w-full max-w-md px-6 space-y-4">
          <p className="text-gray-500">Disponible :</p>
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
              <div
                key={gift.id}
                className={`flex items-center justify-between px-4 py-2 rounded-full text-white ${
                  gift.creatorId === Number(user.id)
                    ? "bg-purple-600"
                    : "bg-pink-600"
                }`}
                onClick={() => handleBuyGift(gift.id, gift.buyers.length > 0)}
              >
                <div className="flex items-center space-x-2 w-90">
                  <span className="capitalize">{gift.name}</span>
                  {gift.creatorId !== Number(user.id) ? (
                    <span className="text-xs">
                      Idée de{" "}
                      <span className="capitalize">{gift.creatorName}</span>
                    </span>
                  ) : null}
                </div>
                <div
                  className="flex items-center justify-between gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewGift(gift.id); 
                  }}
                >
                  <div
                    className={`capitalize bg-white text-sm rounded-full px-1 py-1 ${
                      gift.creatorId === Number(user.id)
                        ? "text-purple-600"
                        : "text-pink-600"
                    }`}
                  >
                    <EyeIcon className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}

          <p className="text-gray-500">Déja pris:</p>
          {gifts
            ?.filter((gift) => gift.buyers.length > 0)
            .map((gift) => (
              <div
                key={gift.id}
                className={`flex items-center justify-between px-4 py-2 rounded-full text-white bg-gray-400
              `}
                onClick={() =>  viewGift(gift.id)}
              >
                <div className="flex items-center space-x-2">
                  <span className="capitalize">{gift.name}</span>
                  {gift.creatorId !== Number(user.id) ? (
                    <span className="text-xs">
                      Idée de{" "}
                      <span className="capitalize">{gift.creatorName}</span>
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="capitalize bg-gray-500 text-gray-300 text-sm rounded-full px-2 py-0.5">
                    {gift.buyers.map((buyer) => buyer.name).join(", ")}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="w-full max-w-md px-6 space-y-4 mt-10">
          <button
            className="flex items-center justify-between px-4 py-2 rounded-full bg-gray-400 w-full"
            onClick={handleAddGift}
          >
            <div className="flex items-center text-white">
              <PlusIcon className="w-5 h-5 mr-2" />
              <span>Ajoute ta propre idée de cadeau</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
