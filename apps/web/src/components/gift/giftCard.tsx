//import { useBuyGift } from "@/hooks/useGift";
import { EyeIcon } from "@heroicons/react/24/solid";
import { GiftDto } from "@repo/dto";
import { useRouter } from "next/navigation";

type GiftCardProps = {
  gift: GiftDto;
  userId: number;
  viewBuyers: boolean;
};

export default function GiftCard({ gift, userId, viewBuyers }: GiftCardProps) {
  const router = useRouter();

  const viewGift = (giftId: number) => {
    router.push(`/gifts/${giftId}`);
  };

  const bgColor =
    gift.buyers.length > 0 && viewBuyers
      ? "bg-gray-300"
      : gift.creatorId === userId
        ? "bg-green-800"
        : "bg-lime-600";

  const textColor =
    gift.buyers.length > 0 && viewBuyers ? "text-gray-700" : "text-white";

  const eyesColor =
    gift.creatorId === userId ? "text-green-800" : "text-lime-600";

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 rounded-full ${textColor} ${
        bgColor
      }`}
      onClick={() => viewGift(gift.id)}
    >
      <div className="flex items-center space-x-2 w-90">
        <span style={{ textTransform: "capitalize" }}>{gift.name}</span>
        {gift.creatorId !== userId && (
          <span className="text-xs">
            Idée de{" "}
            <span style={{ textTransform: "capitalize" }}>
              {gift.creatorName}
            </span>
          </span>
        )}
      </div>

      {gift.buyers.length > 0 && viewBuyers ? (
        <div className="flex items-center justify-between gap-2">
          <div
            className="bg-gray-500 text-gray-300 text-sm rounded-full px-2 py-0.5"
            style={{ textTransform: "capitalize" }}
          >
            {gift.buyers.map((buyer) => buyer.name).join(", ")}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
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
