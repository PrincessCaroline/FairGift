import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { CreateGiftDto, GiftDto, GroupUsersGiftDto } from "@repo/dto";

export function useCreateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGift: CreateGiftDto) => {
      const response = await apiClient.post("/gift", newGift);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGifts"] });
    },
  });
}

export function useBuyGift() {
  return useMutation({
    mutationFn: async (giftId: number) => {
      const response = await apiClient.post(`/gift/${giftId}/buy`);
      return response.data;
    },
  });
}

export function useUserGifts(userId: number | null) {
  return useQuery({
    queryKey: ["userGifts", userId],
    queryFn: async () => {
      const response = await apiClient.get<GiftDto[]>(`/gift/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useMyGifts() {
  return useQuery({
    queryKey: ["myGifts"],
    queryFn: async () => {
      const response = await apiClient.get<GiftDto[]>(`/gift/me`);
      return response.data;
    },
  });
}

export function useGroupUsersGifts(groupId: number) {
  return useQuery({
    queryKey: ["groupGifts", groupId],
    queryFn: async () => {
      const response = await apiClient.get<GroupUsersGiftDto[]>(
        `/gift/group/${groupId}`,
      );
      return response.data;
    },
  });
}

export function useDeleteGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftId: number) => {
      const response = await apiClient.delete(`/gift/${giftId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGifts"] });
    },
  });
}
