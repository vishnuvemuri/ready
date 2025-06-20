import apiClient from './api';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  pronoun: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

// Helper function to check if error is a network error
const isNetworkError = (error: any): boolean => {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message === 'Network Error' ||
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    !error.response
  );
};

export const authService = {
  // Admin signup
  signup: async (userData: SignUpData) => {
    try {
      const response = await apiClient.post('/adminsignup', userData);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Account created successfully'
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // If it's a network error, throw it to trigger fallback
      if (isNetworkError(error)) {
        throw new Error('API_UNAVAILABLE');
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create account. Please try again.'
      };
    }
  },

  // Admin login
  login: async (loginData: LoginData) => {
    try {
      const response = await apiClient.post('/adminlogin', loginData);
      
      // Handle the response based on your API structure
      if (response.data && response.data.message) {
        return {
          success: true,
          data: response.data,
          token: response.data.token || 'mock-token', // Use actual token if provided
          user: response.data.user || response.data.admin || {
            id: 'admin',
            email: loginData.email,
            firstName: 'Admin',
            lastName: 'User'
          },
          message: response.data.message
        };
      }
      
      return {
        success: false,
        message: 'Invalid response from server'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // If it's a network error, throw it to trigger fallback
      if (isNetworkError(error)) {
        throw new Error('API_UNAVAILABLE');
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Invalid email or password'
      };
    }
  },

  // Forgot password - send OTP
  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/adminforgot-password', { email });
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'OTP sent successfully'
      };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // If it's a network error, throw it to trigger fallback
      if (isNetworkError(error)) {
        throw new Error('API_UNAVAILABLE');
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP. Please try again.'
      };
    }
  },

  // Reset password with OTP
  resetPassword: async (resetData: ResetPasswordData) => {
    try {
      const response = await apiClient.post('/adminreset-password', resetData);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password reset successfully'
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      // If it's a network error, throw it to trigger fallback
      if (isNetworkError(error)) {
        throw new Error('API_UNAVAILABLE');
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password. Please try again.'
      };
    }
  }
};