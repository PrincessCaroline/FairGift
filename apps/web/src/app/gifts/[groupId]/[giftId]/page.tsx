"use client";

import React, { useEffect, useState } from "react";
import DeleteModal from "@/components/ui/deleteModal";
import HeaderGeneric from "@/components/ui/headerGeneric";
import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  useBuyGift,
  useCancelBuyGift,
  useGift,
  useUserGifts,
} from "@/hooks/useGift";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { userCanAddGift } from "@/utils/canAddGift";
import { useGroups } from "@/hooks/useGroup";
import GenericButton from "@/components/ui/genericButton";

export default function GiftPage() {
  const router = useRouter();
  const [giftId, setGiftId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const buyGiftMutation = useBuyGift();
  const cancelBuyGiftMutation = useCancelBuyGift();
  const { data: gift, isLoading, isError } = useGift(giftId);
  const { data: gifts } = useUserGifts(Number(gift?.ownerId));
  const { data: groups } = useGroups();
  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useUserProfile();

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    if (pathSegments[3]) setGiftId(Number(pathSegments[3]));
  }, []);

  const cancelBuyGift = async (giftId: number) => {
    await cancelBuyGiftMutation.mutateAsync(giftId);
    router.back();
  };

  const handleBuyGift = () => {
    if (giftId) {
      buyGiftMutation.mutate(giftId);
      router.back();
    }
  };

  if (isLoading || userIsLoading || !gift || !user)
    return <p>Chargement du cadeau...</p>;
  if (isError || userIsError)
    return <p>Une erreur est survenue lors du chargement du cadeau.</p>;

  const canAddGift = userCanAddGift({
    gifts: gifts ?? [],
    userId: gift.ownerId.toString(),
    groups: groups ?? [],
  });

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Détails du cadeau" />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-center items-center px-4 py-2 text-gray-700">
            <span className="font-semibold text-xl">{gift.name}</span>
          </div>
          <p>
            {gift.purchaseLink && (
              <a
                href={gift.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            )}
          </p>

          {gift.purchaseLink && (
            <a
              href={gift.purchaseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out"
            >
              Lien d'achat
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </a>
          )}
          {gift.description && (
            <div className="description-block bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 shadow-sm">
              <p>{gift.description}</p>
            </div>
          )}

          {gift.buyers[0] &&
            user.id.toString() === gift.buyers[0].userId.toString() && (
              <GenericButton
                text=" Je ne l'achète plus"
                Icon={TrashIcon}
                onClick={() => setIsDeleteModalOpen(true)}
                className="mt-6"
              />
            )}

          {((gift.buyers.length === 0 &&
            gift.creatorId.toString() !== gift.ownerId.toString()) ||
            (canAddGift &&
              gift.creatorId.toString() !== gift.ownerId.toString())) && (
            <GenericButton
              text="Je le prend"
              Icon={PlusIcon}
              onClick={handleBuyGift}
              className="mt-6"
            />
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => cancelBuyGift(gift.id)}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce cadeau ?"
        />
      )}
    </div>
  );
}
