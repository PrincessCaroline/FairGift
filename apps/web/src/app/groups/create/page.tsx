"use client";

import HeaderGeneric from "@/components/ui/headerGeneric";
import { useCreateGroup } from "@/hooks/useGroup";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateGroupForm() {
  const [groupName, setGroupName] = useState("");
  const createGroupMutation = useCreateGroup();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGroupMutation.mutate(
      { name: groupName },
      {
        onSuccess: () => {
          router.push(`/dashboard`);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderGeneric name="Inviter un membre" />

      <div className="flex items-center justify-center py-10 ">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 max-w-md w-full mx-auto  text-black"
        >
          <div>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nom du groupe"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-10 px-6 py-3 bg-pink-500 text-white font-semibold rounded-full w-full"
          >
            {createGroupMutation.isPending ? "Création..." : "Créer le groupe"}
          </button>
        </form>
      </div>
    </div>
  );
}
/**
     <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Créer un Nouveau Groupe</h2>

            <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du groupe
                </label>
                <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Entrez le nom du groupe"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 ease-in-out"
            >
                {createGroupMutation.isPending ? 'Création...' : 'Créer le groupe'}
            </button>
        </form>
 */
