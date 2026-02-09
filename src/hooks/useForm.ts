"use client";

import { useState, useCallback } from "react";
import type { FormErrors } from "@/src/types";

interface UseFormOptions<T> {
    initialValues: T;
    validate?: (values: T) => FormErrors;
    onSubmit: (values: T) => Promise<void> | void;
}

/**
 * Custom hook for form state management and validation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useForm<T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit,
}: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (name: keyof T, value: any) => {
            setValues((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Clear error when user starts typing
            if (errors[name as string]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name as string];
                    return newErrors;
                });
            }
        },
        [errors]
    );

    const handleBlur = useCallback((name: keyof T) => {
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    }, []);

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            if (e) {
                e.preventDefault();
            }

            // Mark all fields as touched
            const allTouched = Object.keys(values).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: true,
                }),
                {}
            );
            setTouched(allTouched);

            // Validate
            const validationErrors = validate ? validate(values) : {};
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                setIsSubmitting(true);
                try {
                    await onSubmit(values);
                } catch (error) {
                    console.error("Form submission error:", error);
                } finally {
                    setIsSubmitting(false);
                }
            }
        },
        [values, validate, onSubmit]
    );

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setFieldValue = useCallback((name: keyof T, value: any) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const setFieldError = useCallback((name: string, error: string) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        setFieldValue,
        setFieldError,
        setValues,
    };
}
