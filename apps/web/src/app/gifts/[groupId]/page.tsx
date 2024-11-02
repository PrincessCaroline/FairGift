"use client";

import HeaderGeneric from '@/components/ui/headerGeneric';
import { StarIcon, ArrowTopRightOnSquareIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useMyGifts } from '@/hooks/useGift'; // Assurez-vous d'importer correctement useGift
import { useEffect, useState } from 'react';

export default function GiftListPage() {
    const router = useRouter();
    const { data: gifts, isLoading, isError } = useMyGifts(); // Appel du hook useGift pour récupérer les cadeaux
    const [groupId, setGroupId] = useState<string | null>(null);

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const id = pathSegments[2];
        setGroupId(id);
    }, []);

    const handleAddGift = () => {
        if (groupId) {
            router.push(`/gifts/${groupId}/create`);
        }
    };


    if (isLoading) return <p>Chargement des cadeaux...</p>;
    if (isError) return <p>Une erreur est survenue lors du chargement des cadeaux.</p>;



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
                            {gift.purchaseLink && (
                                <ArrowTopRightOnSquareIcon className="h-5 w-5 cursor-pointer" />
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddGift}
                    className="flex items-center mt-6 px-4 py-2 bg-pink-500 text-white font-semibold rounded-full"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> Ajouter un cadeau
                </button>
            </div>
        </div>
    );
}