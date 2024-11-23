import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import {
  CanIPickGiftDto,
  CreateGiftDto,
  GiftDto,
  GroupUsersGiftDto,
} from "@repo/dto";

export function useCreateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGift: CreateGiftDto) => {
      const response = await apiClient.post("/gift", newGift);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGifts"] });
      queryClient.invalidateQueries({ queryKey: ["userGifts"] });
    },
  });
}

export function useBuyGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftId: number) => {
      const response = await apiClient.post(`/gift/${giftId}/buy`);
      return response.data;
    },
    onSuccess: (_, giftId) => {
      queryClient.invalidateQueries({ queryKey: ["userGifts"] });
      queryClient.invalidateQueries({ queryKey: ["gift", giftId] });
      queryClient.invalidateQueries({ queryKey: ["canIPickGift"] });
      queryClient.invalidateQueries({ queryKey: ["groupGifts"] });
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

export function useCanIPickGift(groupId: number | null) {
  return useQuery({
    queryKey: ["canIPickGift", groupId],
    queryFn: async () => {
      const response = await apiClient.get<CanIPickGiftDto>(
        `/gift/canIPickGift/${groupId}`,
      );
      return response.data;
    },
  });
}

export function useGift(giftId: number | null) {
  return useQuery({
    queryKey: ["gift", giftId],
    queryFn: async () => {
      const response = await apiClient.get<GiftDto>(`/gift/${giftId}`);
      return response.data;
    },
    enabled: !!giftId,
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
    onSuccess: (_, giftId) => {
      queryClient.invalidateQueries({ queryKey: ["userGifts"] });
      queryClient.invalidateQueries({ queryKey: ["myGifts"] });
      queryClient.invalidateQueries({ queryKey: ["gift", giftId] });
      queryClient.invalidateQueries({ queryKey: ["canIPickGift"] });
    },
  });
}

export function useCancelBuyGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftId: number) => {
      const response = await apiClient.delete(`/gift/cancelBuyGif/${giftId}`);
      return response.data;
    },
    onSuccess: (_, giftId) => {
      queryClient.invalidateQueries({ queryKey: ["userGifts"] });
      queryClient.invalidateQueries({ queryKey: ["myGifts"] });
      queryClient.invalidateQueries({ queryKey: ["gift", giftId] });
      queryClient.invalidateQueries({ queryKey: ["canIPickGift"] });
      queryClient.invalidateQueries({ queryKey: ["groupGifts"] });
    },
  });
}

export function useUpdateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      giftId,
      description,
      purchaseLink,
    }: {
      giftId: number;
      description?: string;
      purchaseLink?: string;
    }) => {
      const response = await apiClient.patch(`/gift/${giftId}`, {
        description,
        purchaseLink,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
    },
  });
}
