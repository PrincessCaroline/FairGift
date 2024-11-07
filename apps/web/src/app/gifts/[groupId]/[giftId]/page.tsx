"use client";

import React, { useEffect, useState } from "react";
import DeleteModal from "@/components/ui/deleteModal";
import HeaderGeneric from "@/components/ui/headerGeneric";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useGift } from "@/hooks/useGift";

export default function GiftPage() {
  // const [groupId, setGroupId] = useState<number | null>(null);
  const [giftId, setGiftId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: gift, isLoading, isError } = useGift(giftId);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    // setGroupId(pathSegments[2]);
    if (pathSegments[3]) setGiftId(Number(pathSegments[3]));
  }, []);

  if (isLoading || !gift) return <p>Chargement du cadeau...</p>;
  if (isError)
    return <p>Une erreur est survenue lors du chargement du cadeau.</p>;

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
              className="text-gray-700 flex items-center gap-1"
            >
              Lien d'achat{" "}
              <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />{" "}
            </a>
          )}

          <p className="text-gray-700">{gift.description}</p>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center mt-6 px-4 py-2 bg-pink-500 text-white font-semibold rounded-full w-full"
          >
            <TrashIcon className="h-5 w-5 mr-2" /> Je ne l'achète plus
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => console.log("Cadeau supprimé")}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer ce cadeau ?"
        />
      )}
    </div>
  );
}
