"use client";

import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { GroupWithMembersDto } from "@fair-gift/shared";


export interface CreateGroupData {
    name: string;
}

export interface CreateGroupResponse {
    id: number;
    name: string;
    ownerId: number;
}


async function createGroup(data: CreateGroupData): Promise<CreateGroupResponse> {
    const response = await apiClient.post<CreateGroupResponse>("/group/create", data);
    return response.data;
}

export function useCreateGroup(): UseMutationResult<CreateGroupResponse, unknown, CreateGroupData> {
    const queryClient = useQueryClient()

    return useMutation<CreateGroupResponse, unknown, CreateGroupData>({
        mutationFn: createGroup,
        onSuccess: (data) => {
            console.log("data", data)
            queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
        onError: (error) => {
            console.error(error);
            alert("Erreur lors de la création du groupe.");
        },
    });
}

const fetchGroups = async (): Promise<GroupWithMembersDto[]> => {
    const response = await apiClient.get<GroupWithMembersDto[]>("/group/my-groups");
    return response.data;
};

export function useGroups(): UseQueryResult<GroupWithMembersDto[], Error> {
    return useQuery<GroupWithMembersDto[], Error>(
        { queryKey: ['groups'], queryFn: fetchGroups }
    );
}



