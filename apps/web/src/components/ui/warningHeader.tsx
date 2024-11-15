import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

/* eslint-disable no-unused-vars */
export enum WarningType {
  WARNING = "WARNING",
  ERROR = "ERROR",
}

type WarningHeaderProps = {
  type: WarningType;
  text: string;
};

export default function WarningHeader({ type, text }: WarningHeaderProps) {
  const bgColor =
    type === WarningType.WARNING
      ? "bg-orange-400"
      : type === WarningType.ERROR
        ? "bg-red-700"
        : "";

  return (
    <div className={`p-4 ${bgColor} shadow-md max-w-md mx-auto`}>
      <div className="flex items-center space-x-2 gap-2">
        <ExclamationCircleIcon className="text-white w-6 h-6" />
        <div>
          <div className="text-white font-medium">{text}</div>
          <div className="text-white size-xs italic">
            {type === WarningType.ERROR && "Contacter Caroline ou Jérémy"}
          </div>
        </div>
      </div>
    </div>
  );
}
