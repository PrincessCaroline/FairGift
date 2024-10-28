// hooks/useUserProfile.ts

import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient"; // Utilise apiClient configuré avec axios

// Fonction pour récupérer les informations du profil utilisateur
async function fetchUserData() {
    //const response = await apiClient.get("/users/me");
    const response = await apiClient.get("/users/me");
    return response.data;
}

// Hook React Query pour le profil utilisateur
export function useUserProfile() {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: fetchUserData,
        retry: false, // Pas de retry en cas d’échec
    });
}


