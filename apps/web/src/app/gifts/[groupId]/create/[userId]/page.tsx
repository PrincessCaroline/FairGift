"use client";

import HeaderGeneric from '@/components/ui/headerGeneric';
import { useCreateGift } from '@/hooks/useGift';
import { useUsersByGroupId } from '@/hooks/useGroup';
import { CreateGiftDto } from '@repo/dto';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateGiftPage() {
    const router = useRouter()
    const [giftName, setGiftName] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [purchaseLink, setPurchaseLink] = useState('');
    const [ownerId, setOwnerId] = useState<number | null>(null);
    const createGiftMutation = useCreateGift();
    const [groupId, setGroupId] = useState<number | null>(null);
    //const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
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
            alert('Veuillez sélectionner un propriétaire pour le cadeau.');
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

    return (
        <div className="min-h-screen bg-white">
            <HeaderGeneric name="Ajouter un cadeau" url="/gifts" />
            <div className="flex items-center justify-center py-10">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-white p-6 w-full max-w-sm"
                >
                    <div>
                        <input
                            type="text"
                            value={giftName}
                            onChange={(e) => setGiftName(e.target.value)}
                            placeholder="Libellé du nouveau cadeau"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-pink-500"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            value={giftDescription}
                            onChange={(e) => setGiftDescription(e.target.value)}
                            placeholder="Description du cadeau"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-pink-500"
                        />
                    </div>

                    <div>
                        <input
                            type="url"
                            value={purchaseLink}
                            onChange={(e) => setPurchaseLink(e.target.value)}
                            placeholder="Lien d'achat"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-pink-500"
                        />
                    </div>


                    <div>
                        {isLoading ? (
                            <p>Chargement des utilisateurs...</p>
                        ) : isError ? (
                            <p>Erreur lors du chargement des utilisateurs</p>
                        ) : (
                            <select
                                id="owner"
                                value={ownerId || ''}
                                onChange={(e) => setOwnerId(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-pink-500 text-black"
                            >
                                <option value={""} disabled>Sélectionnez un utilisateur</option>
                                {users?.map((user) => (
                                    <option key={user.userId} value={user.userId}>
                                        {user.userName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-pink-500 text-white font-semibold rounded-full"
                        disabled={createGiftMutation.isPending}
                    >
                        {createGiftMutation.isPending ? 'Création...' : 'CREER'}
                    </button>
                </form>
            </div>
        </div>
    );
}