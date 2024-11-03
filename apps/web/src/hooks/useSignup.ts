// hooks/useSignup.ts

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { CreateUserDto } from "@repo/dto";

interface SignupResponse {
  message: string;
}

async function signupUser(data: CreateUserDto): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>("/users", data);
  return response.data;
}

export function useSignup(): UseMutationResult<
  SignupResponse,
  unknown,
  CreateUserDto
> {
  return useMutation<SignupResponse, unknown, CreateUserDto>({
    mutationFn: signupUser,
    onError: (error) => {
      console.error(error);
      alert("Error creating account.");
    },
  });
}
