import { apiClient } from '../../lib/api-client.js';
import { AUTH_ROUTES } from '../../utils/constants.js';

export const createAuthSlice = (set, get) => ({
    userInfo: undefined,
    isLoading: false,
    
    setUserInfo: (userInfo) => set({ userInfo }),
    setLoading: (isLoading) => set({ isLoading }),
    
    // Register user
    register: async (userData) => {
        try {
            set({ isLoading: true });
            const response = await apiClient.post(AUTH_ROUTES.REGISTER, userData);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        } finally {
            set({ isLoading: false });
        }
    },
    
    // Login user
    login: async (credentials) => {
        try {
            set({ isLoading: true });
            const response = await apiClient.post(AUTH_ROUTES.LOGIN, credentials);
            if (response.data.success) {
                set({ userInfo: response.data.user });
            }
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        } finally {
            set({ isLoading: false });
        }
    },
    
    // Logout user
    logout: async () => {
        try {
            await apiClient.post(AUTH_ROUTES.LOGOUT);
            set({ userInfo: undefined });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Logout failed' 
            };
        }
    },
    
    // Get user info
    getUserInfo: async () => {
        try {
            const response = await apiClient.get(AUTH_ROUTES.USER_INFO);
            if (response.data.success) {
                set({ userInfo: response.data.user });
                return { success: true, data: response.data.user };
            }
            return { success: false };
        } catch (error) {
            set({ userInfo: undefined });
            return { success: false };
        }
    },
    
    // Forgot password
    forgotPassword: async (email) => {
        try {
            set({ isLoading: true });
            const response = await apiClient.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to send reset email' 
            };
        } finally {
            set({ isLoading: false });
        }
    },
    
    // Verify OTP
    verifyOTP: async (email, otp) => {
        try {
            set({ isLoading: true });
            const response = await apiClient.post(AUTH_ROUTES.VERIFY_OTP, { email, otp });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'OTP verification failed' 
            };
        } finally {
            set({ isLoading: false });
        }
    },
    
    // Reset password
    resetPassword: async (resetToken, newPassword) => {
        try {
            set({ isLoading: true });
            const response = await apiClient.post(AUTH_ROUTES.RESET_PASSWORD, { 
                resetToken, 
                newPassword 
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Password reset failed' 
            };
        } finally {
            set({ isLoading: false });
        }
    }
});