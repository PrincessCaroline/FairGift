"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useCheckToken } from "@/hooks/useLogin";
import LoadingPage from "@/components/ui/loading";
import GenericButton from "@/components/ui/genericButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const router = useRouter();
  const { isLoading, isSuccess, isError } = useCheckToken();

  console.log("isLoading", isLoading);
  console.log("isSuccess", isSuccess);
  console.log("isError", isError);

  if (!isLoading && isSuccess && !isError) {
    console.log("Redirecting to dashboard");
    router.push("/dashboard");
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error("Login error:", error);
          alert("Login failed. Please check your credentials.");
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {isLoading || isSuccess ? (
        <LoadingPage />
      ) : (
        <>
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Connexion
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-gray-800 w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-gray-800 w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
              />

              <GenericButton
                text={
                  loginMutation.isPending ? "Connexion en cours" : "Connexion"
                }
                disabled={loginMutation.isPending}
                type="submit"
                onClick={() => {}}
                className="mt-6"
              />
            </form>
            {/* 
            <div className="text-center">
              <p className="text-gray-600">Don't have an account?</p>
              <button
                onClick={() => router.push("/signup")}
                className="mt-2 text-blue-500 hover:underline"
              >
                Register
              </button>
            </div>
            */}
          </div>
        </>
      )}
    </div>
  );
}
