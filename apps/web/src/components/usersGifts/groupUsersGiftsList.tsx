
import { useGroupUsersGifts } from '@/hooks/useGift';
import { StarIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/solid';
import { GiftDto, GroupUsersGiftDto, } from '@repo/dto';
import { useRouter } from 'next/navigation';

type GroupUsersGiftsListProps = {
    groupIdSelected: number
}

export default function GroupUsersGiftsList({ groupIdSelected }: GroupUsersGiftsListProps) {
    const router = useRouter();
    const { data: groupGifts, isLoading, isError } = useGroupUsersGifts(groupIdSelected);

    const handleViewUserClick = (userId: number) => {
        router.push(`/user/${userId}?groupId=${groupIdSelected}`);
    };

    if (isLoading) return <p>Chargement des cadeaux...</p>;
    if (isError) return <p>Une erreur est survenue lors du chargement des cadeaux.</p>;

    return (
        <div className="p-4 space-y-6">
            {groupGifts?.map((userGift: GroupUsersGiftDto) => (
                <div key={userGift.userId} className="p-4 bg-white shadow rounded-lg">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <h2 className="ml-4 text-lg font-semibold">{userGift.userName}</h2>
                    </div>
                    <div className="space-y-2">
                        {userGift.gifts.map((gift: GiftDto) => (
                            <div
                                key={gift.id}
                                className={`flex items-center justify-between px-4 py-2 rounded-full  bg-purple-500`}
                            >
                                <div className="flex items-center text-white">
                                    <StarIcon className="w-5 h-5 mr-2" />
                                    <span>{gift.name}</span>
                                </div>
                                <PencilSquareIcon className="w-5 h-5 text-white" />
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 flex items-center text-gray-600 hover:text-gray-800" onClick={() => handleViewUserClick(userGift.userId)}>
                        <PlusIcon className="w-5 h-5 mr-2" /> Ajouter un cadeau
                    </button>
                </div>
            ))}
        </div>

    );
}