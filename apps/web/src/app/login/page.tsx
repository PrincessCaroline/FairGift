"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useCheckToken } from "@/hooks/useLogin";



export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginMutation = useLogin();
    const router = useRouter();
    const { isLoading, isSuccess } = useCheckToken()

    if (isSuccess) router.push("/dashboard");

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
            }
        );
    };

    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {
                isLoading || isSuccess ?
                    (<p>Checking authentication...</p>)
                    :
                    <>
                        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="text-gray-800 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="text-gray-800 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={loginMutation.isPending}
                                    className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {loginMutation.isPending ? "Logging in..." : "Log In"}
                                </button>
                            </form>
                            <div className="text-center">
                                <p className="text-gray-600">Don't have an account?</p>
                                <button
                                    onClick={() => router.push("/signup")}
                                    className="mt-2 text-blue-500 hover:underline"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </>
            }</div >

    );
}
