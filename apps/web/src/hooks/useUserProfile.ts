import { useQuery } from "@tanstack/react-query";
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
