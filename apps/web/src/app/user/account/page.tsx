"use client";

import GenericButton from "@/components/ui/genericButton";
import HeaderGeneric from "@/components/ui/headerGeneric";
import LoadingPage from "@/components/ui/loading";
import WarningHeader, { WarningType } from "@/components/ui/warningHeader";
import { useLogout } from "@/hooks/useLogin";
import { useUpdateUser, useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserAccount() {
  const router = useRouter();
  const logoutMutation = useLogout();
  const updateUserMutation = useUpdateUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useUserProfile();

  const [userName, setUserName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isValidLength = password.length >= 7;
    return hasUpperCase && hasDigit && isValidLength;
  };

  const handleUpdate = async () => {
    setErrorMessage(null);

    if (currentPassword && (!newPassword || !confirmPassword)) {
      setErrorMessage(
        "Veuillez remplir tous les champs pour changer le mot de passe.",
      );
      return;
    }
    if (newPassword && !validatePassword(newPassword)) {
      setErrorMessage(
        "Le nouveau mot de passe doit contenir au moins 7 caractères, une majuscule et un chiffre.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    updateUserMutation.mutate({
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
      name: userName || undefined,
    });
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push("/");
  };

  if (userIsLoading || !user) return <LoadingPage />;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderGeneric name="Mon Compte" />
      {(userIsError || errorMessage) && (
        <WarningHeader
          text={
            errorMessage
              ? errorMessage
              : "Erreur lors du chargement des données utilisateur."
          }
          type={WarningType.ERROR}
        />
      )}
      <div className="flex-grow py-10">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-xl font-semibold text-gray-700 capitalize">
            Vos Information
          </h1>
        </div>

        <div className="w-full  px-6 space-y-4 mx-auto">
          <h2 className="text-gray-700 font-semibold">Modification</h2>
          {/* Modification du nom */}

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="text"
              value={user.email ?? ""}
              onChange={() => {}}
              disabled={true}
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Nom
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Modifier votre nom"
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Modification du mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mot de passe actuel"
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez le nouveau mot de passe"
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <GenericButton
            text={
              updateUserMutation.isPending ? "Mise à jour..." : "Mettre à jour"
            }
            onClick={handleUpdate}
            disabled={updateUserMutation.isPending}
            className="w-full"
          />
        </div>
      </div>

      <div className="bg-white w-full px-6 py-4 mx-auto sticky bottom-0">
        <GenericButton text="Déconnexion" onClick={handleLogout} color="red" />
      </div>
    </div>
  );
}
