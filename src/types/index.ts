



// User types
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Auth types
export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

// Registration types
export interface RegistrationFormData {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Camp Preferences
    campDate: string;
    accommodationType: "shared" | "private" | "couple";
    dietaryRestrictions?: string;

    // Emergency Contact
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;

    // Additional Information
    experience?: string;
    goals?: string;
    medicalConditions?: string;
}

export interface RegistrationResponse {
    success: boolean;
    registrationId: string;
    message: string;
}

// Form validation types
export interface FormErrors {
    [key: string]: string;
}

export interface FormState<T> {
    values: T;
    errors: FormErrors;
    touched: { [key: string]: boolean };
    isSubmitting: boolean;
}

// API types
export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}

export interface ApiResponse<T = any> {
    data?: T;
    error?: ApiError;
    success: boolean;
}

// Location types
export interface Location {
    address: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    formattedAddress?: string;
}

// Volunteer types
export interface VolunteerFormData {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;

    // Skills and Experience
    skills: string[];
    experience: string;
    previousVolunteer: boolean;

    // Availability
    availableDates: string[];
    hoursPerWeek: string;

    // Location
    location: Location;

    // Documents
    documents?: {
        certification?: string; // Cloudinary URL
        backgroundCheck?: string; // Cloudinary URL
    };

    // Additional
    motivation: string;
    references?: string;
}

export interface VolunteerResponse {
    success: boolean;
    volunteerId: string;
    message: string;
}

// Event types
export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: Location;
    capacity: number;
    registeredCount: number;
    images: string[]; // Cloudinary URLs
    createdAt: string;
}

// File upload types
export interface FileUploadResponse {
    url: string;
    publicId: string;
}
