import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, isAuthenticated } from '../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            if (isAuthenticated()) {
                try {
                    const response = await authAPI.getProfile();
                    if (response.success) {
                        setUser(response.data);
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    authAPI.logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authAPI.login(email, password);
        if (response.success) {
            setUser(response.data);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        const response = await authAPI.signup(name, email, password);
        if (response.success) {
            setUser(response.data);
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
