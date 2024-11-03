import { StarIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export interface MemberCardProps {
  name: String;
}

export default function MemberCard(memberCardProps: MemberCardProps) {
  return (
    <div className="max-w-xs p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full" />
        <div className="text-xl font-medium text-gray-700">
          {memberCardProps.name}
        </div>
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        <div className="flex items-center justify-between px-4 py-2 rounded-full bg-purple-500">
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-indigo-900" />
            <span className="text-sm font-medium text-white">Trompette</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 rounded-full bg-pink-500">
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-pink-900" />
            <span className="text-sm font-medium text-white">
              Machine à écrire
            </span>
          </div>
          <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
