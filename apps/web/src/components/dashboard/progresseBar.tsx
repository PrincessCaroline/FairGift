import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

type ProgressBarProps = {
  totalGifts: number;
  goalGifts: number;
};

export default function ProgressBar({
  totalGifts,
  goalGifts,
}: ProgressBarProps) {
  const progress = Math.min((totalGifts / goalGifts) * 100, 100);

  return (
    <div className={`p-4 bg-red-700 shadow-md max-w-md mx-auto`}>
      <div className="flex items-center space-x-2 gap-2">
        <ExclamationCircleIcon className="text-white w-6 h-6" />
        <div className="text-white font-medium">
          {`Il te manque ${goalGifts - totalGifts} idées de cadeaux pour jouer.`}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mt-2">
        <div
          className={`h-full bg-red-500 rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
