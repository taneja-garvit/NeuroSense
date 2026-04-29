// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('neurosense_token');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
    localStorage.setItem('neurosense_token', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
    localStorage.removeItem('neurosense_token');
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
};

// Auth API
export const authAPI = {
    signup: async (name: string, email: string, password: string) => {
        const response = await authFetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        if (response.success && response.data.token) {
            setAuthToken(response.data.token);
        }
        return response;
    },

    login: async (email: string, password: string) => {
        // DEMO MODE: Static credentials for frontend-only deployment (Remove this block after backend deployment)
        const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL || 'demo@neurosense.com';
        const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'demo123';
        // Check if credentials match demo credentials (TEMPORARY - Remove after backend deployment)
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
            // Generate a dummy token for demo mode (TEMPORARY - Remove after backend deployment)
            const dummyToken = 'demo_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            // Store the dummy token (TEMPORARY - Remove after backend deployment)
            setAuthToken(dummyToken);
            // Return success response with demo user data (TEMPORARY - Remove after backend deployment)
            return {
                success: true,
                data: {
                    token: dummyToken,
                    _id: 'demo_user_id',
                    name: 'Demo User',
                    email: email,
                },
            };
        }
        // END DEMO MODE BLOCK - Remove above code after backend deployment

        const response = await authFetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (response.success && response.data.token) {
            setAuthToken(response.data.token);
        }
        return response;
    },

    getProfile: async () => {
        return authFetch(`${API_BASE_URL}/auth/me`);
    },

    logout: () => {
        removeAuthToken();
    },
};

// Assessment API
export const assessmentAPI = {
    getQuestions: async () => {
        const response = await fetch(`${API_BASE_URL}/assessment/questions`);
        return response.json();
    },

    submitAssessment: async (questionnaire: any, textInput?: string) => {
        return authFetch(`${API_BASE_URL}/assessment/submit`, {
            method: 'POST',
            body: JSON.stringify({ questionnaire, textInput }),
        });
    },

    getHistory: async () => {
        return authFetch(`${API_BASE_URL}/assessment/history`);
    },

    getById: async (id: string) => {
        return authFetch(`${API_BASE_URL}/assessment/${id}`);
    },
};

// Recommendations API
export const recommendationsAPI = {
    getAll: async () => {
        return authFetch(`${API_BASE_URL}/recommendations`);
    },

    getByRiskLevel: async (riskLevel: string) => {
        return authFetch(`${API_BASE_URL}/recommendations/${riskLevel}`);
    },
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export default {
    auth: authAPI,
    assessment: assessmentAPI,
    recommendations: recommendationsAPI,
    isAuthenticated,
};
