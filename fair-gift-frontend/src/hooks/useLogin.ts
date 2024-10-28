// hooks/useLogin.ts

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string; // Le back-end peut renvoyer un message de succès
}

async function loginUser(data: LoginData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/login", data, {
        withCredentials: true, // Important pour envoyer et recevoir les cookies
    });
    return response.data;
}

export function useLogin(): UseMutationResult<LoginResponse, unknown, LoginData> {
    return useMutation<LoginResponse, unknown, LoginData>({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // alert(data.message || "Logged in successfully!");
            // Redirige l'utilisateur ou effectue d'autres actions
        },
        onError: (error) => {
            console.error(error);
            alert("Invalid credentials.");
        },
    });
}
