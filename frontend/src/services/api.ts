// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
    // AI chat assessment
    start: async () => {
        return authFetch(`${API_BASE_URL}/assessment/start`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
    },

    answer: async (assessmentId: string, answer: string) => {
        return authFetch(`${API_BASE_URL}/assessment/answer`, {
            method: 'POST',
            body: JSON.stringify({ assessmentId, answer }),
        });
    },

    // Legacy static questionnaire
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
    getAI: async (assessmentId: string) => {
        return authFetch(`${API_BASE_URL}/recommendations/ai/${assessmentId}`);
    },

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
