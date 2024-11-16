"use client";

import GenericButton from "@/components/ui/genericButton";
import HeaderGeneric from "@/components/ui/headerGeneric";
import LoadingPage from "@/components/ui/loading";
import WarningHeader, { WarningType } from "@/components/ui/warningHeader";
import { useGift, useUpdateGift } from "@/hooks/useGift";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateGiftPage() {
  const router = useRouter();
  const updateGiftMutation = useUpdateGift();
  const [giftDescription, setGiftDescription] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [giftId, setGiftId] = useState<number | null>(null);
  const { data: gift, isLoading, isError } = useGift(giftId);

  useEffect(() => {
    setGiftId(Number(window.location.pathname.split("/")[2]));
  }, []);

  useEffect(() => {
    if (gift) {
      setGiftDescription(gift.description || "");
      setPurchaseLink(gift.purchaseLink || "");
    }
  }, [gift]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!giftDescription && !purchaseLink && !giftId) {
      return;
    }

    await updateGiftMutation.mutateAsync({
      giftId: giftId ?? -1,
      description: giftDescription,
      purchaseLink,
    });
    router.back();
  };

  if (isLoading || !gift) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Modifier un Cadeau" />
      {isError && (
        <WarningHeader
          text="Erreur lors du chargement du cadeau."
          type={WarningType.ERROR}
        />
      )}
      <div className="flex items-center justify-center py-10">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 w-full">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {gift.name}
            </h3>
          </div>

          <div>
            <textarea
              value={giftDescription}
              onChange={(e) => setGiftDescription(e.target.value)}
              placeholder="Description du cadeau"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <input
              type="url"
              value={purchaseLink}
              onChange={(e) => setPurchaseLink(e.target.value)}
              placeholder="Lien d'achat"
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <GenericButton
            text={
              updateGiftMutation.isPending ? "Mise à jour..." : "Mettre à jour"
            }
            disabled={updateGiftMutation.isPending}
            type="submit"
            onClick={() => {}}
            className="mt-6"
          />
        </form>
      </div>
    </div>
  );
}
