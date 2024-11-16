import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { UserDto } from "@repo/dto";

async function fetchUserData(): Promise<UserDto> {
  const response = await apiClient.get<UserDto>("/users/me");
  return response.data;
}

export function useUserProfile() {
  return useQuery<UserDto>({
    queryKey: ["userProfile"],
    queryFn: fetchUserData,
  });
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiClient.get<UserDto>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      name,
    }: {
      currentPassword?: string;
      newPassword?: string;
      name?: string;
    }) => {
      const response = await apiClient.patch(`/users/`, {
        currentPassword,
        newPassword,
        name,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      alert("Profil mis à jour");
    },
  });
}
