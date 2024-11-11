import { EyeIcon } from "@heroicons/react/24/solid";
import { GiftDto } from "@repo/dto";
import { useRouter } from "next/navigation";

type GiftCardSimpleProps = {
  gift: GiftDto;
  groupId: number;
  userId: number;
};

export default function GiftCardSimple({
  gift,
  groupId,
  userId,
}: GiftCardSimpleProps) {
  const router = useRouter();

  const viewGift = (giftId: number) => {
    router.push(`/gifts/${groupId}/${giftId}`);
  };

  const bgColor = gift.creatorId === userId ? "bg-indigo-600" : "bg-indigo-400";
  const textColor = "text-white";
  const eyesColor =
    gift.creatorId === userId ? "text-indigo-600" : "text-indigo-400";

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 rounded-full ${textColor} ${
        bgColor
      }`}
      onClick={() => viewGift(gift.id)}
    >
      <div className="flex items-center space-x-2 w-90">
        <span className="capitalize">{gift.name}</span>
        {gift.creatorId !== userId && (
          <span className="text-xs">
            Idée de <span className="capitalize">{gift.creatorName}</span>
          </span>
        )}
      </div>

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
    </div>
  );
}
