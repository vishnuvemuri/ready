import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, SignUpData } from '../services/authService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: SignUpData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resetPasswordWithOTP: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  verifyChangePasswordOTP: (otp: string) => Promise<boolean>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<boolean>;
  isLoading: boolean;
}

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  gender: string;
  profileImage?: string | null;
}

interface StoredUser extends User {
  password: string;
  dateOfBirth: string;
  pronoun: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempResetEmail, setTempResetEmail] = useState('');
  const [tempChangePasswordData, setTempChangePasswordData] = useState<{
    currentPassword: string;
    newPassword: string;
  } | null>(null);

  // Helper function to get users from localStorage (fallback for offline mode)
  const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem('famiory_users');
    return users ? JSON.parse(users) : [];
  };

  // Helper function to save users to localStorage (fallback for offline mode)
  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem('famiory_users', JSON.stringify(users));
  };

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('famiory_admin_user');
    const storedToken = localStorage.getItem('famiory_admin_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('famiory_admin_user');
        localStorage.removeItem('famiory_admin_token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // Try API first
      const result = await authService.login({ email, password });
      
      if (result.success && result.user && result.token) {
        const userForState = {
          id: result.user.id || result.user._id || Date.now().toString(),
          email: result.user.email,
          firstName: result.user.firstName || result.user.first_name || '',
          lastName: result.user.lastName || result.user.last_name || '',
          gender: result.user.gender,
          profileImage: result.user.profileImage || result.user.profile_image
        };
        
        localStorage.setItem('famiory_admin_token', result.token);
        localStorage.setItem('famiory_admin_user', JSON.stringify(userForState));
        setUser(userForState);
        return { success: true, message: result.message };
      }
      
      // If API returns unsuccessful result, fall back to local authentication
      console.warn('API login unsuccessful, falling back to local authentication');
      return await loginFallback(email, password);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if it's an API unavailable error (network error)
      if (error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using local authentication');
      } else {
        console.warn('API login failed, falling back to local authentication');
      }
      
      // Fall back to local authentication
      return await loginFallback(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const loginFallback = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check for default admin account
    if (email === 'admin@famiory.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin',
        email: 'admin@famiory.com',
        firstName: 'Admin',
        lastName: 'User'
      };
      
      localStorage.setItem('famiory_admin_token', 'mock-admin-token');
      localStorage.setItem('famiory_admin_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return { success: true };
    }

    // Check registered users
    const storedUsers = getStoredUsers();
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userForState = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        gender: foundUser.gender,
        profileImage: foundUser.profileImage
      };
      
      localStorage.setItem('famiory_admin_token', `mock-token-${foundUser.id}`);
      localStorage.setItem('famiory_admin_user', JSON.stringify(userForState));
      setUser(userForState);
      return { success: true };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = async (userData: SignUpData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // Try API first
      const result = await authService.signup(userData);
      
      if (result.success) {
        return { success: true, message: result.message };
      }
      
      // If API returns unsuccessful result, fall back to local storage
      console.warn('API signup unsuccessful, falling back to local storage');
      return await signupFallback(userData);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Check if it's an API unavailable error (network error)
      if (error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using local storage');
      } else {
        console.warn('API signup failed, falling back to local storage');
      }
      
      // Fall back to local storage
      return await signupFallback(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const signupFallback = async (userData: SignUpData): Promise<{ success: boolean; message?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUsers = getStoredUsers();
    
    // Check if user already exists
    const existingUser = storedUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return { 
        success: false, 
        message: 'Email already exists. Please use a different email or try logging in.' 
      };
    }

    // Create new user
    const newUser: StoredUser = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      pronoun: userData.pronoun
    };

    // Save to localStorage
    storedUsers.push(newUser);
    saveUsers(storedUsers);

    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    // Clear local storage and state
    localStorage.removeItem('famiory_admin_token');
    localStorage.removeItem('famiory_admin_user');
    setUser(null);
    setTempResetEmail('');
    setTempChangePasswordData(null);
  };

  // Reset Password - Step 1: Send reset email/OTP
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try API first
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setTempResetEmail(email); // Store email for next steps
        return true;
      }
      
      // If API returns unsuccessful result, fall back to mock behavior
      console.warn('API forgot password unsuccessful, falling back to mock behavior');
      return await resetPasswordFallback(email);
      
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      // Check if it's an API unavailable error (network error)
      if (error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using mock behavior');
      } else {
        console.warn('API forgot password failed, falling back to mock behavior');
      }
      
      // Fall back to mock behavior
      return await resetPasswordFallback(email);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFallback = async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUsers = getStoredUsers();
    const userExists = storedUsers.some(u => u.email === email) || email === 'admin@famiory.com';
    
    if (userExists) {
      setTempResetEmail(email);
      console.log(`Password reset email sent to ${email} (mock)`);
      return true;
    }
    
    return false;
  };

  // Reset Password - Step 2: Verify OTP (mock for now)
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    // For now, accept any 6-digit OTP as valid
    // In real implementation, this would verify with backend
    await new Promise(resolve => setTimeout(resolve, 500));
    return otp.length === 6;
  };

  // Reset Password - Step 3: Reset password with OTP
  const resetPasswordWithOTP = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try API first
      const result = await authService.resetPassword({ email, otp, newPassword });
      
      if (result.success) {
        setTempResetEmail(''); // Clear stored email
        return true;
      }
      
      // If API returns unsuccessful result, fall back to local behavior
      console.warn('API reset password unsuccessful, falling back to local behavior');
      return await resetPasswordWithOTPFallback(email, otp, newPassword);
      
    } catch (error: any) {
      console.error('Reset password with OTP error:', error);
      
      // Check if it's an API unavailable error (network error)
      if (error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using local behavior');
      } else {
        console.warn('API reset password failed, falling back to local behavior');
      }
      
      // Fall back to local behavior
      return await resetPasswordWithOTPFallback(email, otp, newPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordWithOTPFallback = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (otp.length !== 6) {
      return false;
    }

    // Update password for admin
    if (email === 'admin@famiory.com') {
      // In real app, backend would update admin password
      setTempResetEmail('');
      return true;
    }

    // Update password for regular users
    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      storedUsers[userIndex].password = newPassword;
      saveUsers(storedUsers);
      setTempResetEmail('');
      return true;
    }
    
    return false;
  };

  // Change Password - Step 1: Verify current password and send OTP
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Store the new password for later use
    setTempChangePasswordData({ currentPassword, newPassword });
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!user) {
      return false;
    }

    // Check for admin account
    if (user.id === 'admin') {
      if (currentPassword === 'admin123') {
        console.log(`Change password OTP sent to ${user.email}: 123456`);
        return true;
      } else {
        return false;
      }
    }

    // Check for regular users
    const storedUsers = getStoredUsers();
    const foundUser = storedUsers.find(u => u.id === user.id);
    
    if (foundUser && foundUser.password === currentPassword) {
      console.log(`Change password OTP sent to ${user.email}: 123456`);
      return true;
    }
    
    return false;
  };

  // Change Password - Step 2: Verify OTP and complete password change
  const verifyChangePasswordOTP = async (otp: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock OTP verification
    const isValidOTP = otp === '123456';
    
    if (isValidOTP && user && tempChangePasswordData) {
      // Update password in local storage for non-admin users
      if (user.id !== 'admin') {
        const storedUsers = getStoredUsers();
        const userIndex = storedUsers.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
          storedUsers[userIndex].password = tempChangePasswordData.newPassword;
          saveUsers(storedUsers);
        }
      }
      
      // Clear temp data
      setTempChangePasswordData(null);
      return true;
    }
    
    return false;
  };

  const updateProfile = async (profileData: ProfileUpdateData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      if (!user) {
        return false;
      }

      // Update current user state
      const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        gender: profileData.gender,
        profileImage: profileData.profileImage || user.profileImage
      };
      setUser(updatedUser);
      localStorage.setItem('famiory_admin_user', JSON.stringify(updatedUser));

      // Update stored users (except admin)
      if (user.id !== 'admin') {
        const storedUsers = getStoredUsers();
        const userIndex = storedUsers.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
          storedUsers[userIndex] = {
            ...storedUsers[userIndex],
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            gender: profileData.gender,
            profileImage: profileData.profileImage || storedUsers[userIndex].profileImage
          };
          saveUsers(storedUsers);
        }
      }

      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    verifyOTP,
    resetPasswordWithOTP,
    changePassword,
    verifyChangePasswordOTP,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};