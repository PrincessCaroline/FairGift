import { useBuyGift } from "@/hooks/useGift";
import { EyeIcon } from "@heroicons/react/24/solid";
import { GiftDto } from "@repo/dto";
import { useRouter } from "next/navigation";

type GiftCardProps = {
  gift: GiftDto;
  groupId: number;
  userId: number;
  canAddGift?: boolean;
};

export default function GiftCard({
  gift,
  groupId,
  userId,
  canAddGift = true,
}: GiftCardProps) {
  const router = useRouter();
  const buyGiftMutation = useBuyGift();

  const handleBuyGift = (giftId: number) => {
    if (canAddGift) {
      buyGiftMutation.mutate(giftId);
    } else if (gift.creatorId !== userId) {
      buyGiftMutation.mutate(giftId);
    } else {
      viewGift(giftId);
    }
  };

  const viewGift = (giftId: number) => {
    router.push(`/gifts/${groupId}/${giftId}`);
  };

  const bgColor =
    gift.buyers.length > 0
      ? "bg-gray-300"
      : gift.creatorId === userId
        ? "bg-green-800"
        : "bg-lime-600";

  const textColor = gift.buyers.length > 0 ? "text-gray-700" : "text-white";

  const eyesColor =
    gift.creatorId === userId ? "text-green-800" : "text-lime-600";

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 rounded-full ${textColor} ${
        bgColor
      }`}
      onClick={() =>
        gift.buyers.length === 0 ? handleBuyGift(gift.id) : viewGift(gift.id)
      }
    >
      <div className="flex items-center space-x-2 w-90">
        <span className="capitalize">{gift.name}</span>
        {gift.creatorId !== userId && (
          <span className="text-xs">
            Idée de <span className="capitalize">{gift.creatorName}</span>
          </span>
        )}
      </div>

      {gift.buyers.length > 0 ? (
        <div className="flex items-center justify-between gap-2">
          <div className="capitalize bg-gray-500 text-gray-300 text-sm rounded-full px-2 py-0.5">
            {gift.buyers.map((buyer) => buyer.name).join(", ")}
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-between gap-2"
          onClick={(e) => {
            e.stopPropagation();
            viewGift(gift.id);
          }}
        >
          <div
            className={`capitalize bg-white text-sm rounded-full px-1 py-1 ${
              eyesColor
            }`}
          >
            <EyeIcon className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}
