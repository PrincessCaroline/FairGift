"use client";

import { useEffect, useState } from "react";
import HeaderGeneric from "@/components/ui/headerGeneric";
import {
  StarIcon,
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useDeleteGift, useMyGifts } from "@/hooks/useGift";
import { useUserProfile } from "@/hooks/useUserProfile";
import DeleteModal from "@/components/ui/deleteModal";
import InfoModal from "@/components/ui/infoModale";

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
  const deleteGift = useDeleteGift();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState<number | null>(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const id = pathSegments[2];
    setGroupId(id);
  }, []);

  const openDeleteModal = (giftId: number) => {
    setGiftToDelete(giftId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setGiftToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (giftToDelete) {
      deleteGift.mutate(giftToDelete, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  };

  const handleAddGift = () => {
    if (groupId && user) {
      router.push(`/gifts/${groupId}/create/${user.id}`);
    }
  };

  if (giftsIsLoading || userIsLoading) return <p>Chargement des cadeaux...</p>;
  if (giftsIsError || userIsError)
    return <p>Une erreur est survenue lors du chargement des cadeaux.</p>;

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Mes cadeaux" />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md space-y-4">
          {gifts?.map((gift) => (
            <div
              key={gift.id}
              className="flex items-center justify-between px-4 py-2 rounded-full bg-purple-600 text-white"
            >
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5" />
                <span>{gift.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {gift.purchaseLink && (
                  <a
                    href={gift.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 cursor-pointer" />
                  </a>
                )}
                <TrashIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() =>
                    gift.buyers.length > 0
                      ? setIsInfoModalOpen(true)
                      : openDeleteModal(gift.id)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddGift}
          className="flex items-center mt-6 px-4 py-2 bg-pink-500 text-white font-semibold rounded-full w-full"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Ajouter un cadeau
        </button>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce cadeau ?"
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Impossible de suppimer ce cadeau"
        message="Le cadeau ne peut pas être supprimé car il a déjà été acheté par un utilisateur."
      />
    </div>
  );
}
