"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useCheckToken } from "@/hooks/useLogin";
import LoadingPage from "@/components/ui/loading";
import GenericButton from "@/components/ui/genericButton";
import LanguageSwitcher from "@/components/languageSwitcher/languageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const router = useRouter();
  const { isLoading, isSuccess, isError } = useCheckToken();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoading && isSuccess && !isError) {
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
          setErrorMessage(t('loginPage.error'));
        },
      },
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-1 bg-gray-50">
        {isLoading || isSuccess ? (
          <LoadingPage />
        ) : (
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {t('loginPage.login')}
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder={t('loginPage.email')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                required
                className="text-gray-800 w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
              />
              <input
                type="password"
                placeholder={t('loginPage.password')}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                required
                className="text-gray-800 w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-yellow-400"
              />

              {errorMessage && (
                <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
              )}

              <GenericButton
                text={
                  loginMutation.isPending
                    ? t('loginPage.connecting')
                    : t('loginPage.login')
                }
                disabled={loginMutation.isPending}
                onClick={() => { }}
                type="submit"
                className="w-full"
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
        )}
      </div>
      <footer className="bg-gray-100 border-t py-4 mb-4">
        <LanguageSwitcher />
      </footer>
    </div>
  );
}
