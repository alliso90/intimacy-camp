"use client";

import { useState, useEffect, useCallback } from "react";
import { authService } from "@/src/services/auth";
import type { User, LoginCredentials, RegisterData } from "@/src/types";

/**
 * Custom hook for authentication state management
 */
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        Promise.resolve().then(() => {
            setUser(currentUser);
            setIsLoading(false);
        });
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);

        const response = await authService.login(credentials);

        if (response.success && response.data) {
            authService.saveUser(response.data.user, response.data.token);
            setUser(response.data.user);
            setIsLoading(false);
            return { success: true };
        } else {
            const errorMessage = response.error?.message || "Login failed";
            setError(errorMessage);
            setIsLoading(false);
            return { success: false, error: errorMessage };
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        setIsLoading(true);
        setError(null);

        const response = await authService.register(data);

        if (response.success && response.data) {
            authService.saveUser(response.data.user, response.data.token);
            setUser(response.data.user);
            setIsLoading(false);
            return { success: true };
        } else {
            const errorMessage = response.error?.message || "Registration failed";
            setError(errorMessage);
            setIsLoading(false);
            return { success: false, error: errorMessage };
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        await authService.logout();
        authService.clearUser();
        setUser(null);
        setIsLoading(false);
    }, []);

    const isAuthenticated = !!user;

    return {
        user,
        isLoading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
    };
}
