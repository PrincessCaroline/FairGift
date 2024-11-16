import { useState } from "react";
import {
  GiftIcon,
  CogIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { GroupMemberCountDto } from "@repo/dto";

type HeaderProps = {
  groups: GroupMemberCountDto[];
  groupIdSelected: number | undefined;
  setGroupIdSelected: React.Dispatch<React.SetStateAction<number>>;
};

export default function Header({
  groups,
  setGroupIdSelected,
  groupIdSelected,
}: HeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const groupName =
    groups.find((group) => group.id === groupIdSelected)?.name ?? "";

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelect = (id: number) => {
    setGroupIdSelected(id);
    localStorage.setItem("selectedGroupId", id.toString());
    setIsDropdownOpen(false);
  };

  const handleCreateGroupClick = () => {
    //router.push("/groups/create");
  };

  const handleGiftClick = () => {
    router.push(`/gifts`);
  };

  return (
    <div className="relative">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center" onClick={() => handleGiftClick()}>
          <GiftIcon className="h-6 w-6 text-red-500" />
        </div>

        <div>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-transparent font-medium text-gray-800 focus:outline-none"
          >
            <span>{groupName}</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center">
          <CogIcon
            className="h-6 w-6 text-gray-600"
            onClick={() => router.push("/user/account")}
          />
        </div>
      </header>

      {isDropdownOpen && (
        <div className="absolute left-0 top-full w-full bg-white border rounded-lg shadow-lg z-10 mt-2">
          <ul>
            {groups.map((group) => (
              <li
                key={group.id}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(group.id)}
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3" />
                <div>
                  <span className="font-medium text-gray-800">
                    {group.name}
                  </span>
                  <p className="text-sm text-gray-500">
                    {group.memberCount} Membres
                  </p>
                </div>
              </li>
            ))}
            <li
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer text-yellow-500"
              onClick={() => handleCreateGroupClick()}
            >
              <PlusCircleIcon className="h-8 w-8 mr-3" />
              <div>
                <span className="font-medium">Créer un Groupe</span>
                <p className="text-sm">Pour votre famille, vos amis, ...</p>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
