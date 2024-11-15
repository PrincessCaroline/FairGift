"use client";

import GenericButton from "@/components/ui/genericButton";
import HeaderGeneric from "@/components/ui/headerGeneric";
import LoadingPage from "@/components/ui/loading";
import WarningHeader, { WarningType } from "@/components/ui/warningHeader";
import { useCreateGift } from "@/hooks/useGift";
import { useUsersByGroupId } from "@/hooks/useGroup";
import { CreateGiftDto } from "@repo/dto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateGiftPage() {
  const router = useRouter();
  const [giftName, setGiftName] = useState("");
  const [giftDescription, setGiftDescription] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const createGiftMutation = useCreateGift();
  const [groupId, setGroupId] = useState<number | null>(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const groupIdFromUrl = pathSegments[2];
    const userIdFromUrl = pathSegments[4];

    if (groupIdFromUrl && !isNaN(Number(groupIdFromUrl))) {
      setGroupId(Number(groupIdFromUrl));
    } else {
      setGroupId(null);
    }

    if (userIdFromUrl && !isNaN(Number(userIdFromUrl))) {
      setOwnerId(Number(userIdFromUrl));
    } else {
      setOwnerId(null);
    }
  }, []);

  const { data: users, isLoading, isError } = useUsersByGroupId(groupId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerId) {
      alert("Veuillez sélectionner un propriétaire pour le cadeau.");
      return;
    }

    const newGift: CreateGiftDto = {
      name: giftName,
      description: giftDescription,
      purchaseLink,
      ownerId,
    };
    await createGiftMutation.mutateAsync(newGift);
    router.back();
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Ajouter un cadeau" url={`/gifts/${groupId}`} />
      <div className="flex items-center justify-center py-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 w-full max-w-sm"
        >
          <div>
            {isError ? (
              <WarningHeader
                text="Erreur lors du chargement des utilisateurs."
                type={WarningType.ERROR}
              />
            ) : (
              <>
                <label
                  htmlFor="owner"
                  className="block text-sm font-medium text-gray-400"
                >
                  Ce cadeau est pour
                </label>
                <select
                  id="owner"
                  value={ownerId || ""}
                  onChange={(e) => setOwnerId(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400 text-gray-800"
                >
                  <option value={""} disabled>
                    Sélectionnez un utilisateur
                  </option>
                  {users?.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.userName}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div>
            <input
              type="text"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              placeholder="Libellé du nouveau cadeau"
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
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
              createGiftMutation.isPending ? "Création..." : "Créer le cadeau"
            }
            disabled={createGiftMutation.isPending}
            type="submit"
            onClick={() => {}}
            className="mt-6"
          />
        </form>
      </div>
    </div>
  );
}
