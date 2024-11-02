import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { CreateGroupDto, GroupMemberCountDto, GroupMemberDto } from "@repo/dto";
import apiClient from "@/lib/apiClient";

async function createGroup(data: CreateGroupDto): Promise<void> {
    const response = await apiClient.post<void>("/group/create", data);
    return response.data;
}

export function useCreateGroup(): UseMutationResult<void, unknown, CreateGroupDto> {
    const queryClient = useQueryClient()

    return useMutation<void, unknown, CreateGroupDto>({
        mutationFn: createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
        onError: (error) => {
            console.error(error);
            alert("Erreur lors de la création du groupe.");
        },
    });
}

const fetchGroups = async (): Promise<GroupMemberCountDto[]> => {
    const response = await apiClient.get<GroupMemberCountDto[]>("/group/my-groups");
    return response.data;
};

export function useGroups(): UseQueryResult<GroupMemberCountDto[], Error> {
    return useQuery<GroupMemberCountDto[], Error>(
        { queryKey: ['groups'], queryFn: fetchGroups }
    );
}

export function useUsersByGroupId(groupId: number | null) {
    return useQuery({
        queryKey: ['groupUsers', groupId],
        queryFn: async () => {
            const response = await apiClient.get<GroupMemberDto[]>(`/group/${groupId}/users`);
            return response.data;
        },
        enabled: groupId !== null && groupId !== undefined
    });
}





