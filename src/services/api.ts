import type { ApiResponse, ApiError } from "@/src/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Base API service with error handling
 */
class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        try {
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        message: data.message || "An error occurred",
                        code: response.status.toString(),
                        details: data,
                    },
                };
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Failed to parse response",
                    details: error,
                },
            };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Network error",
                    details: error,
                },
            };
        }
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: data ? JSON.stringify(data) : undefined,
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Network error",
                    details: error,
                },
            };
        }
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: data ? JSON.stringify(data) : undefined,
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Network error",
                    details: error,
                },
            };
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Network error",
                    details: error,
                },
            };
        }
    }
}

export const api = new ApiService();
