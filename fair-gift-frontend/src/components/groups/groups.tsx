"use client";
import { useGroups } from "@/hooks/useGroup";

export default function GroupsList() {
    const { data: groups, isLoading, isError } = useGroups();

    if (isLoading) return <div className="text-center mt-4">Loading...</div>;
    if (isError) return <div className="text-center mt-4 text-red-500">Erreur lors du chargement des groupes.</div>;

    return (
        <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">My Groups</h2>
            {groups?.map((group) => (
                <div key={group.id} className="bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">Owner ID: {group.ownerId}</p>
                    <h4 className="mt-3 font-semibold text-gray-800">Members:</h4>
                    <ul className="mt-1 space-y-1">
                        {group.members.map((member) => (
                            <li key={member.id} className="flex justify-between items-center">
                                <span className="text-gray-700">{member.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
