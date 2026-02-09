import { api } from "./api";
import type { AuthResponse, LoginCredentials, RegisterData } from "@/src/types";
import { API_ENDPOINTS } from "@/src/lib/constants";

/**
 * Authentication service
 */
export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials) {
        return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },

    /**
     * Register new user
     */
    async register(data: RegisterData) {
        return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    },

    /**
     * Logout user
     */
    async logout() {
        return api.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser() {
        if (typeof window === "undefined") return null;
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Save user to localStorage
     */
    saveUser(user: any, token: string) {
        if (typeof window === "undefined") return;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    },

    /**
     * Clear user from localStorage
     */
    clearUser() {
        if (typeof window === "undefined") return;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    },

    /**
     * Get auth token
     */
    getToken() {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("token");
    },
};
