// hooks/useSignup.ts

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

interface SignupResponse {
    message: string;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
}

async function signupUser(data: SignupData): Promise<SignupResponse> {
    const response = await apiClient.post<SignupResponse>("/users", data);
    return response.data;
}

export function useSignup(): UseMutationResult<SignupResponse, unknown, SignupData> {
    return useMutation<SignupResponse, unknown, SignupData>({
        mutationFn: signupUser,
        onSuccess: () => {
            alert("Account created successfully!");
        },
        onError: (error) => {
            console.error(error);
            alert("Error creating account.");
        },
    });
}
