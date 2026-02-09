"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, UserPlus, MessageCircle, Home } from "lucide-react";




type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    maritalStatus: string;
    departments: string[]; // <--- add this
    isLeader: string;
    ministry: string;
    customMinistry: string;
};



type Step = {
    id: number;
    title: string;
    fields: (keyof FormData)[];
};


const getSteps = (isLeader: boolean): Step[] => {
    const baseSteps: Step[] = [
        { id: 1, title: "Basic Information", fields: ["firstName", "lastName"] },
        { id: 2, title: "Contact Details", fields: ["email", "phone"] },
        { id: 3, title: "Location", fields: ["address"] },
        { id: 4, title: "Personal Status", fields: ["gender", "maritalStatus"] },
        { id: 5, title: "Volunteer Department", fields: ["departments"] },
        { id: 6, title: "Leadership Status", fields: ["isLeader"] },
    ];

    if (isLeader) {
        baseSteps.push({ id: 7, title: "Ministry Information", fields: ["ministry", "customMinistry"] });
    }

    return baseSteps;
};

const DEPARTMENTS = [
    { id: "protocol", name: "Team Beniah (Protocol, Ushering & Security)" },
    { id: "creative", name: "Team Solomon (Ambience & Aesthetics)" },
    { id: "media", name: "Team Obadiah (Media & Communication)" },
    { id: "logistics", name: "Team Nehemiah (Logistics & Maintenance)" },
    { id: "technical", name: "Team Bezalel (Media & Technical)" },
    { id: "prayer", name: "Team Epaphras (Prayer)" },
    { id: "registration", name: "Team Stephen (People & programs)" },
    { id: "welfare", name: "Team Jethro (Counselling)" },
    { id: "music", name: "Team Asaph (Music)" },
    { id: "medical", name: "Team Luke (Medical)" },
];

export default function VolunteerRegisterPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        maritalStatus: "",
        departments: [],
        isLeader: "",
        ministry: "",
        customMinistry: "",
    });


    const STEPS = getSteps(formData.isLeader === "yes");

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDepartmentToggle = (deptId: string) => {
        setFormData((prev) => {
            if (prev.departments.includes(deptId)) {
                return { ...prev, departments: [] };
            }
            return { ...prev, departments: [deptId] };
        });
    };


    const canProceed = () => {
        const currentFields = STEPS[currentStep - 1].fields;
        return currentFields.every((field) => {
            if (field === "customMinistry" && formData.ministry !== "other") {
                return true;
            }
            if (field === "departments") {
                return formData.departments.length > 0; // At least one department required
            }

            // TS-safe access for string fields
            const value = formData[field];
            return typeof value === "string" ? value.trim() !== "" : true;
        });
    };

    const handleNext = () => {
        if (currentStep < STEPS.length && canProceed()) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // app/volunteer/register/page.tsx (updated handleSubmit function)
    const handleSubmit = async () => {
        if (!canProceed()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'volunteer',
                    ...formData,
                    // Keep isLeader as "yes" or "no"
                    isLeader: formData.isLeader,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setIsSuccess(true);
            console.log('Registration successful:', data);
        } catch (error: any) {
            alert(error.message || 'Failed to submit registration');
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleRegisterAnother = () => {
        setIsSuccess(false);
        setCurrentStep(1);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            gender: "",
            maritalStatus: "",
            departments: [],
            isLeader: "",
            ministry: "",
            customMinistry: "",
        });
    };

    const renderStepContent = () => {
        const step = STEPS[currentStep - 1];

        return (
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
            >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">{step.title}</h3>

                {step.id === 1 && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter your last name"
                            />
                        </div>
                    </>
                )}

                {step.id === 2 && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="+234 xxx xxx xxxx"
                            />
                        </div>
                    </>
                )}

                {step.id === 3 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            placeholder="Enter your full address"
                        />
                    </div>
                )}

                {step.id === 4 && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Marital Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.maritalStatus}
                                onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select marital status</option>
                                <option value="single">Single</option>
                                <option value="engaged">Engaged</option>
                                <option value="married">Married</option>
                            </select>
                        </div>
                    </>
                )}

                {step.id === 5 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Department <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-4">
                            Select the department you&apos;d like to volunteer for
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {DEPARTMENTS.map((dept) => {
                                const isSelected = formData.departments.includes(dept.id);

                                return (
                                    <button
                                        key={dept.id}
                                        type="button"
                                        onClick={() => handleDepartmentToggle(dept.id)}
                                        className={`
                                            px-4 py-3 rounded-lg border-2 text-left font-medium transition-all
                                            ${isSelected
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">{dept.name}</span>
                                            {isSelected && (
                                                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step.id === 6 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Are you a leader of a ministry or fellowship? <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.isLeader}
                            onChange={(e) => handleInputChange("isLeader", e.target.value)}
                            className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            <option value="">Select an option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                )}

                {step.id === 7 && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Your Ministry <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.ministry}
                                onChange={(e) => handleInputChange("ministry", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select ministry</option>
                                <option value="rccg">RCCG (Redeemed Christian Church of God)</option>
                                <option value="winners">Winners Chapel (Living Faith Church)</option>
                                <option value="coza">COZA (Commonwealth of Zion Assembly)</option>
                                <option value="daystar">Daystar Christian Centre</option>
                                <option value="houseontherock">House on the Rock Church</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {formData.ministry === "other" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type the name of your ministry <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.customMinistry}
                                    onChange={(e) => handleInputChange("customMinistry", e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter your ministry name"
                                />
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>
        );
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center max-w-lg w-full"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Volunteer Registration Successful!
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for volunteering for The Intimacy Camp 2026. You'll receive a confirmation email with further details shortly.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleRegisterAnother}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            <UserPlus className="w-5 h-5" />
                            Register Another Volunteer
                        </button>

                        <a
                            href="https://chat.whatsapp.com/LSHPc8r3Ara96rzBBJsYhl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Join Volunteer WhatsApp Group
                        </a>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
            {/* Home Button */}
            <a
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 text-gray-700 font-medium"
            >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
            </a>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-6">
                        <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            TIC'26
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
                        The Intimacy Camp 2026
                    </h1>
                    <p className="text-xl text-white/90 font-light italic">
                        Volunteer Registration
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`w-full h-2 mx-1 rounded-full transition-colors ${step.id <= currentStep
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                    : "bg-white/30"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-center text-white text-sm">
                        Step {currentStep} of {STEPS.length}
                    </p>
                </div>

                {/* Main Card */}
                <motion.div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
                    <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevious}
                                className="flex-1 h-12 px-6 rounded-lg border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium flex items-center justify-center gap-2 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous
                            </button>
                        )}

                        {currentStep < STEPS.length ? (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className={`flex-1 h-12 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${canProceed()
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!canProceed() || isSubmitting}
                                className={`flex-1 h-12 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${canProceed() && !isSubmitting
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Submit Registration
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}