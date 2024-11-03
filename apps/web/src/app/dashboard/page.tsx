"use client";

import { useRouter } from "next/navigation";
import HeaderDashboard from "@/components/dashboard/header";
import GroupUsersGiftsList from "@/components/usersGifts/groupUsersGiftsList";
import { useGroups } from "@/hooks/useGroup";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: groups, isLoading, isError } = useGroups();

  const [groupIdSelected, setGroupIdSelected] = useState<number>(-1);

  useEffect(() => {
    if (groups && groups.length > 0 && groupIdSelected === -1) {
      setGroupIdSelected(groups[0].id);
    }
  }, [groups, groupIdSelected]);

  if (isError) {
    router.push("/login");
    return null;
  }

  if (isLoading || !groups) return <p>Loading...</p>;

  return (
    <div>
      <HeaderDashboard
        groups={groups}
        groupIdSelected={groupIdSelected}
        setGroupIdSelected={setGroupIdSelected}
      />
      <div className="min-h-screen bg-white ">
        {groupIdSelected >= 0 ? (
          <GroupUsersGiftsList groupIdSelected={groupIdSelected} />
        ) : null}
      </div>
    </div>
  );
}
