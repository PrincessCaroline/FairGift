'use client';


import HeaderGeneric from '@/components/ui/headerGeneric';
import { useBuyGift, useUserGifts } from '@/hooks/useGift';
import { useUser } from '@/hooks/useUserProfile';
import { PlusIcon, StarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function UserGiftPage() {
    const searchParams = useSearchParams();
    const groupId = searchParams.get('groupId');
    const router = useRouter();
    const buyGiftMutation = useBuyGift()
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const id = pathSegments[2];
        if (id && !isNaN(Number(id))) {
            setUserId(Number(id));
        } else {
            setUserId(null);
        }
    }, []);

    const { data: user, isLoading: userIsLoading, isError: userIsError } = useUser(userId)
    const { data: gifts, isLoading: giftIsLoading, isError: giftIsError } = useUserGifts(userId);


    const handleAddGift = () => {
        router.push(`/gifts/${groupId}/create/${userId}`);
    };

    const handleBuyGift = (giftId: number, isBuy: boolean) => {
        if (!isBuy) {
            buyGiftMutation.mutate(giftId)
        }

    };

    console.log("gifts", gifts)

    if (giftIsLoading || userIsLoading) return <p>Chargement des cadeaux...</p>;
    if (giftIsError || userIsError) return <p>Erreur lors du chargement des cadeaux.</p>;

    return (
        <div className="min-h-screen bg-white">
            <HeaderGeneric name="Echanger une idée de cadeau" />
            <div className="py-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                    <h1 className="text-xl font-semibold">{user?.name}</h1>
                </div>

                <div className="w-full max-w-md px-6 space-y-4">
                    {gifts?.map((gift) => (
                        <div
                            key={gift.id}
                            className={`flex items-center justify-between px-4 py-2 rounded-full  text-white ${gift.buyers.length > 0
                                ? 'bg-red-400'
                                : 'bg-purple-600'
                                }`}
                            onClick={() => handleBuyGift(gift.id, gift.buyers.length > 0)}
                        >
                            <div className="flex items-center space-x-2">
                                <StarIcon className="w-5 h-5" />
                                <span>{gift.name}</span>
                            </div>
                            {gift.purchaseLink && (
                                <a href={gift.purchaseLink} target="_blank" rel="noopener noreferrer">
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5 cursor-pointer" />
                                </a>
                            )}
                        </div>
                    ))}

                    <div className="flex items-center justify-center text-gray-600 font-semibold">OU</div>

                    <button
                        onClick={handleAddGift}
                        className="flex items-center justify-center w-full px-4 py-3 bg-pink-500 text-white font-semibold rounded-full"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Ajoute ta propre idée de cadeau
                    </button>
                </div>
            </div>
        </div>
    );
}