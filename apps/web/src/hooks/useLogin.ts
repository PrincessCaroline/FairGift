// hooks/useLogin.ts

import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { LoginDto } from "@repo/dto";

export interface LoginResponse {
  message: string; // Le back-end peut renvoyer un message de succès
}

async function loginUser(data: LoginDto): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/login", data);
  return response.data;
}

export function useLogin(): UseMutationResult<
  LoginResponse,
  unknown,
  LoginDto
> {
  return useMutation<LoginResponse, unknown, LoginDto>({
    mutationFn: loginUser,
    onError: (error) => {
      console.error(error);
    },
  });
}

async function checkToken() {
  const response = await apiClient.get("/login/check-token");
  return response.data;
}

export function useCheckToken(): UseQueryResult<any> {
  return useQuery<any, Error>({
    queryKey: ["checkToken"],
    queryFn: checkToken,
    retry: false,
    refetchOnMount: true,
    staleTime: Infinity,
    cacheTime: Infinity,
  } as UseQueryOptions<any, Error>);
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/login/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkToken"] });
      queryClient.refetchQueries({ queryKey: ["checkToken"] });
    },
  });
}
