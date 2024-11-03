type ProgressBarProps = {
    totalGifts: number;
    goalGifts: number;
    color?: 'pink' | 'green';
};

export default function ProgressBar({
    totalGifts,
    goalGifts,
  }: ProgressBarProps) {
    // Calcul de la progression en pourcentage
    const progress = Math.min((totalGifts / goalGifts) * 100, 100);

    const bgColor = totalGifts < goalGifts ? 'bg-pink-400' : 'bg-green-400';
    const progressBgColor = totalGifts < goalGifts ? 'bg-pink-500' : 'bg-green-500';

    return (
        <div className="p-4 space-y-6 max-w-3xl mx-auto">
        <div className={`flex items-center ${bgColor} rounded-lg h-12 shadow-md p-1 px-3 w-full max-w-lg`}>
            <span className="text-white font-medium mr-3">Progression</span>
            <div className="w-full bg-white rounded-full h-4 overflow-hidden">
                <div
                    className={`h-full ${progressBgColor} rounded-full`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
        </div>
    );
};


