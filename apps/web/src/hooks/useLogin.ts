// hooks/useLogin.ts

import { useMutation, UseMutationResult, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { LoginDto } from "@repo/dto";



export interface LoginResponse {
    message: string; // Le back-end peut renvoyer un message de succès
}

async function loginUser(data: LoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/login", data);
    return response.data;
}

export function useLogin(): UseMutationResult<LoginResponse, unknown, LoginDto> {
    return useMutation<LoginResponse, unknown, LoginDto>({
        mutationFn: loginUser,
        onError: (error) => {
            console.error(error);
            alert("Invalid credentials.");
        },
    });
}

async function checkToken() {
    const response = await apiClient.get("/login/check-token");
    return response.data;
};

export function useCheckToken(): UseQueryResult<any> {
    return useQuery<any, Error>({
        queryKey: ["checkToken"],
        queryFn: checkToken,
        retry: false,
    } as UseQueryOptions<any, Error>);
}
