// src/app/dashboard/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "../../hooks/useUserProfile";
import GroupsList from "@/components/groups/groups";
import { BeakerIcon } from '@heroicons/react/24/solid'


export default function DashboardPage() {
    const router = useRouter();
    const { data, isLoading, isError } = useUserProfile();

    // Redirige vers /login si l'utilisateur n'est pas authentifié (si l'API renvoie une erreur)
    if (isError) {
        console.log("Redirection vers login");
        router.push("/login");
        return null; // Empêche le rendu pendant la redirection
    }

    if (isLoading) return <p>Loading...</p>;

    const handleCreateGroupClick = () => {
        router.push("/groups/create");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">
                    Welcome, {data.name}!   <BeakerIcon className="size-6 text-blue-500" />
                </h1>
                <p className="text-center text-gray-600">You are now on the dashboard.</p>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleCreateGroupClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Créer un Groupe
                    </button>
                </div>
                <div className="mt-8">
                    <GroupsList />
                </div>
            </div>
        </div>
    );
}
