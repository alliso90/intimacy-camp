import { api } from "./api";
import type { RegistrationFormData, RegistrationResponse } from "@/src/types";
import { API_ENDPOINTS } from "@/src/lib/constants";

/**
 * Registration service
 */
export const registrationService = {
    /**
     * Submit registration form
     */
    async submitRegistration(data: RegistrationFormData) {
        return api.post<RegistrationResponse>(
            API_ENDPOINTS.REGISTRATION.SUBMIT,
            data
        );
    },

    /**
     * Confirm registration with token
     */
    async confirmRegistration(token: string) {
        return api.post<{ success: boolean; message: string }>(
            API_ENDPOINTS.REGISTRATION.CONFIRM,
            { token }
        );
    },

    /**
     * Validate registration form data
     */
    validateRegistrationData(data: Partial<RegistrationFormData>): {
        isValid: boolean;
        errors: { [key: string]: string };
    } {
        const errors: { [key: string]: string } = {};

        // Personal Information
        if (!data.firstName?.trim()) {
            errors.firstName = "First name is required";
        }
        if (!data.lastName?.trim()) {
            errors.lastName = "Last name is required";
        }
        if (!data.email?.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Invalid email format";
        }
        if (!data.phone?.trim()) {
            errors.phone = "Phone number is required";
        }

        // Camp Preferences
        if (!data.campDate) {
            errors.campDate = "Camp date is required";
        }
        if (!data.accommodationType) {
            errors.accommodationType = "Accommodation type is required";
        }

        // Emergency Contact
        if (!data.emergencyContactName?.trim()) {
            errors.emergencyContactName = "Emergency contact name is required";
        }
        if (!data.emergencyContactPhone?.trim()) {
            errors.emergencyContactPhone = "Emergency contact phone is required";
        }
        if (!data.emergencyContactRelation?.trim()) {
            errors.emergencyContactRelation = "Emergency contact relation is required";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    },
};
