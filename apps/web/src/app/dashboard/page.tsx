"use client";

import { useRouter } from "next/navigation";
import HeaderDashboard from "@/components/dashboard/header";
import GroupUsersGiftsList from "@/components/usersGifts/groupUsersGiftsList";
import { useGroups } from "@/hooks/useGroup";
import { useEffect, useState } from "react";
import ProgressBar from "@/components/dashboard/progresseBar";
import { useMyGifts } from "@/hooks/useGift";
import LoadingPage from "@/components/ui/loading";

export default function DashboardPage() {
  const router = useRouter();
  const { data: groups, isLoading, isError } = useGroups();
  const {
    data: gifts,
    isLoading: giftsIsLoading,
    isError: giftsIsError,
  } = useMyGifts();

  const [groupIdSelected, setGroupIdSelected] = useState<number>(-1);

  useEffect(() => {
    const savedGroupId = localStorage.getItem("selectedGroupId");

    if (savedGroupId) {
      setGroupIdSelected(Number(savedGroupId));
    } else if (groups && groups.length > 0) {
      setGroupIdSelected(Number(groups[0].id));
      localStorage.setItem("selectedGroupId", groups[0].id.toString());
    }
  }, [groups]);

  if (isError || giftsIsError) {
    router.push("/login");
    return null;
  }

  if (isLoading || giftsIsLoading || !groups || !gifts) return <LoadingPage />;

  const goalGifts = groups.reduce(
    (acc, group) => acc + (group.memberCount - 1),
    0,
  );
  const canPickGift = (gifts?.length ?? 0) >= goalGifts;

  return (
    <div>
      <HeaderDashboard
        groups={groups}
        groupIdSelected={groupIdSelected}
        setGroupIdSelected={setGroupIdSelected}
      />
      <div className="min-h-screen bg-white">
        {!canPickGift && (
          <ProgressBar totalGifts={gifts?.length ?? 0} goalGifts={goalGifts} />
        )}
        {groupIdSelected >= 0 ? (
          <GroupUsersGiftsList
            groupIdSelected={groupIdSelected}
            canPickGift={canPickGift}
          />
        ) : null}
      </div>
    </div>
  );
}
