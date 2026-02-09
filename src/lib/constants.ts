export const APP_NAME = "Intimacy Camp";
export const APP_DESCRIPTION = "Setting a generation on fire for Jesus - equipping young leaders to passionately pursue their faith";

export const ROUTES = {
    HOME: "/",
    REGISTER: "/register",
    CONFIRM: "/confirm",
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        LOGOUT: "/api/auth/logout",
    },
    REGISTRATION: {
        SUBMIT: "/api/registration/submit",
        CONFIRM: "/api/registration/confirm",
    },
} as const;
export const FEATURES = [
    {
        title: "Prophetic Impartation",
        description: "Receive personalized prophecies and spiritual gifts activation through seasoned ministers",
        icon: "Sparkles",
    },
    {
        title: "Powerful Worship",
        description: "Experience God's presence in an atmosphere of anointed worship and praise",
        icon: "Music",
    },
    {
        title: "Deep Prayer Life",
        description: "Learn effective prayer strategies and intercession for breakthrough",
        icon: "Pray",
    },
    {
        title: "Biblical Teaching",
        description: "Sound doctrine and practical Word-based teachings for spiritual growth",
        icon: "BookOpen",
    },
    {
        title: "Healing Ministry",
        description: "Experience physical, emotional, and spiritual healing through God's power",
        icon: "Heart",
    },
    {
        title: "Kingdom Networking",
        description: "Connect with like-minded believers and ministry leaders for partnership",
        icon: "Users",
    },
    {
        title: "Deliverance Sessions",
        description: "Freedom from spiritual bondage and demonic oppression",
        icon: "Shield",
    },
    {
        title: "Holy Spirit Guidance",
        description: "Learn to be led by the Spirit in all areas of life",
        icon: "Wind",
    },
    {
        title: "Spiritual Discipline",
        description: "Training in fasting, meditation, and other spiritual disciplines",
        icon: "Target",
    },
] as const;
export const TESTIMONIALS = [
    {
        name: "Sarah & Michael",
        role: "Couple, 2023 Attendee",
        content: "This camp transformed our relationship. We learned to communicate on a level we never thought possible.",
        rating: 5,
    },
    {
        name: "Jessica Thompson",
        role: "Individual Participant",
        content: "The tools and insights I gained have helped me in all my relationships, not just romantic ones.",
        rating: 5,
    },
    {
        name: "David & Emma",
        role: "Married 15 Years",
        content: "After years together, we rediscovered the spark and deepened our connection beyond our expectations.",
        rating: 5,
    },
] as const;
