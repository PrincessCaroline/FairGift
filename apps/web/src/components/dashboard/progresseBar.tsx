type ProgressBarProps = {
  totalGifts: number;
  goalGifts: number;
};

export default function ProgressBar({
  totalGifts,
  goalGifts,
}: ProgressBarProps) {
  const progress = Math.min((totalGifts / goalGifts) * 100, 100);

  const bgColor = totalGifts < goalGifts ? "bg-pink-400" : "bg-green-400";
  const progressBgColor =
    totalGifts < goalGifts ? "bg-pink-500" : "bg-green-500";

  return (
    <div className={`p-4 ${bgColor} shadow-md max-w-md mx-auto`}>
      <p className="text-white font-medium mb-2">
        {totalGifts < goalGifts
          ? `Il te manque ${goalGifts - totalGifts} idées de cadeaux pour compléter ta liste d'achat.`
          : "Tu peux jouer"}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${progressBgColor} rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
