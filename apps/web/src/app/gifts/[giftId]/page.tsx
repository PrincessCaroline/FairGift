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
  useDeleteGift,
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
  const [modalAction, setModalAction] = useState<
    "cancelBuyGift" | "deleteGift" | null
  >(null);
  const buyGiftMutation = useBuyGift();
  const deleteMutation = useDeleteGift();
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
    if (pathSegments[2]) setGiftId(Number(pathSegments[2]));
  }, []);

  const handleBuyGift = () => {
    if (giftId) {
      buyGiftMutation.mutate(giftId);
      setIsDeleteModalOpen(false);
      router.back();
    }
  };

  const handleCancelBuyGift = async () => {
    if (giftId) {
      await cancelBuyGiftMutation.mutateAsync(giftId);
      setIsDeleteModalOpen(false);
      router.back();
    }
  };

  const handleDeleteGift = async () => {
    if (giftId) {
      await deleteMutation.mutateAsync(giftId);
      setIsDeleteModalOpen(false);
      router.back();
    }
  };

  const openModal = (action: "cancelBuyGift" | "deleteGift") => {
    setModalAction(action);
    setIsDeleteModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (modalAction === "cancelBuyGift") {
      handleCancelBuyGift();
    } else if (modalAction === "deleteGift") {
      handleDeleteGift();
    }
  };

  if (isLoading || userIsLoading || !gift || !user) return <LoadingPage />;

  const canAddGift = userCanAddGift({
    gifts: gifts ?? [],
    userId: gift.ownerId.toString(),
    groups: groups ?? [],
  });

  const displayAddGiftButton =
    canAddGift ||
    (!canAddGift &&
      (gifts?.every(
        (g) =>
          !g.buyers.some(
            (buyer) => buyer.userId.toString() === user.id.toString(),
          ),
      ) ||
        gift.creatorId.toString() !== gift.ownerId.toString()));

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Détails du cadeau" />
      {(isError || userIsError) ?? (
        <WarningHeader
          text="Une erreur est survenue lors du chargement du cadeau."
          type={WarningType.ERROR}
        />
      )}

      {!displayAddGiftButton && !gift.buyers.length && (
        <WarningHeader
          text={`Vous ne pouvez plus acheter de cadeaux créés par ${gift.creatorName}. Il faut en laisser pour tout le monde !`}
          type={WarningType.WARNING}
        />
      )}

      <div className="flex flex-col items-center min-h-screen p-4 text-gray-700">
        <div className="w-full max-w-md bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
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
            <div>
              {gift.buyers.length > 0 &&
                gift.ownerId.toString() !== user.id.toString() && (
                  <div>
                    <div
                      className="bg-gray-500 text-gray-300 text-sm rounded-full px-2 py-0.5"
                      style={{ textTransform: "capitalize" }}
                    >
                      {gift.buyers.map((buyer) => buyer.name).join(", ")}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="relative flex justify-center">
            {gift.purchaseLink ? (
              <a
                href={gift.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition duration-200 ease-in-out w-full"
              >
                {gift.description
                  ? gift.description
                  : "Ce cadeau n'a pas de description"}
                <ArrowTopRightOnSquareIcon className="absolute top-3 right-2 h-5 w-5 text-white" />
              </a>
            ) : (
              <div className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition duration-200 ease-in-out w-full">
                {gift.description
                  ? gift.description
                  : "Ce cadeau n'a pas de description"}
              </div>
            )}
          </div>

          {gift.buyers[0] &&
            user.id.toString() === gift.buyers[0].userId.toString() && (
              <GenericButton
                text="Je ne l'achète plus"
                Icon={TrashIcon}
                onClick={() => openModal("cancelBuyGift")}
                className="mt-6"
              />
            )}

          {gift.buyers.length === 0 &&
            user.id.toString() !== gift.ownerId.toString() &&
            displayAddGiftButton && (
              <GenericButton
                text="Je le prend"
                Icon={PlusCircleIcon}
                onClick={handleBuyGift}
                className="mt-6"
              />
            )}

          {gift.buyers.length === 0 &&
            user.id.toString() === gift.creatorId.toString() && (
              <GenericButton
                text="Supprimer"
                Icon={TrashIcon}
                onClick={() => openModal("deleteGift")}
                className="mt-6"
              />
            )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleModalConfirm}
          title={
            modalAction === "cancelBuyGift"
              ? "Confirmer l'annulation"
              : "Confirmer la suppression"
          }
          message={
            modalAction === "cancelBuyGift"
              ? "Êtes-vous sûr de vouloir annuler cet achat ?"
              : "Êtes-vous sûr de vouloir supprimer ce cadeau ?"
          }
        />
      )}
    </div>
  );
}
