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
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-pink-500"
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
