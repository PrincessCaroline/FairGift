"use client";

import React, { useEffect, useState } from "react";
import DeleteModal from "@/components/ui/deleteModal";
import HeaderGeneric from "@/components/ui/headerGeneric";
import {
  ArrowTopRightOnSquareIcon,
  PlusCircleIcon,
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
import LoadingPage from "@/components/ui/loading";
import WarningHeader, { WarningType } from "@/components/ui/warningHeader";

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

  if (isLoading || userIsLoading || !gift || !user) return <LoadingPage />;

  const canAddGift = userCanAddGift({
    gifts: gifts ?? [],
    userId: gift.ownerId.toString(),
    groups: groups ?? [],
  });

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Détails du cadeau" />
      {(isError || userIsError) ?? (
        <WarningHeader
          text="Une erreur est survenue lors du chargement du cadeau."
          type={WarningType.ERROR}
        />
      )}
      <div className="flex flex-col items-center min-h-screen p-4 text-gray-700">
        <div className="w-full max-w-md bg-white p-6 space-y-4">
          <div>
            <h1
              className="font-semibold text-xl"
              style={{ textTransform: "capitalize" }}
            >
              {gift.name}
            </h1>
            <p className="text-sm text-gray-600 italic">
              Idée de {gift.creatorName}
            </p>
          </div>

          <div className="relative flex justify-center">
            <a
              href={gift.purchaseLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition duration-200 ease-in-out w-full"
            >
              {gift.description
                ? gift.description
                : "Ce cadeau n'a pas description"}
              {gift.purchaseLink ? (
                <ArrowTopRightOnSquareIcon className="absolute top-3 right-2 h-5 w-5 text-white" />
              ) : null}
            </a>
          </div>

          {gift.buyers[0] &&
            user.id.toString() === gift.buyers[0].userId.toString() && (
              <GenericButton
                text="Je ne l'achète plus"
                Icon={TrashIcon}
                onClick={() => setIsDeleteModalOpen(true)}
                className="mt-6"
              />
            )}

          {gift.buyers.length === 0 &&
            user.id.toString() !== gift.ownerId.toString() &&
            (canAddGift ||
              (!canAddGift &&
                gifts &&
                (gifts.every(
                  (g) =>
                    !g.buyers.some(
                      (buyer) => buyer.userId.toString() === user.id.toString(),
                    ),
                ) ||
                  gift.creatorId.toString() !== gift.ownerId.toString()))) && (
              <GenericButton
                text="Je le prend"
                Icon={PlusCircleIcon}
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
