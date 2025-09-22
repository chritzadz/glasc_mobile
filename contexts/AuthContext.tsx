import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { User } from "../model/User";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const generateToken = async (userData: User): Promise<string> => {
    try {
      console.log("Generating token for user:", userData.id);

      const tokenData = {
        userId: userData.id,
        email: userData.email,
        timestamp: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000,
      };

      const token = btoa(JSON.stringify(tokenData));

      console.log("Token generated successfully");
      return token;
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error("Failed to generate token: " + (error as Error).message);
    }
  };

  const verifyToken = async (token: string): Promise<any> => {
    try {
      const decoded = JSON.parse(atob(token));

      if (decoded.exp && decoded.exp < Date.now()) {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  };

  const storeToken = async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error storing token:", error);
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  };

  const getStoredToken = async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error("Error getting token from SecureStore:", error);
      try {
        return await AsyncStorage.getItem(TOKEN_KEY);
      } catch (fallbackError) {
        console.error("Error getting token from AsyncStorage:", fallbackError);
        return null;
      }
    }
  };

  const removeStoredToken = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token from SecureStore:", error);
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  };

  const storeUserData = async (userData: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const getStoredUserData = async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  };

  const removeStoredUserData = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  const login = async (userData: User): Promise<void> => {
    try {
      const token = await generateToken(userData);
      await storeToken(token);
      await storeUserData(userData);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await removeStoredToken();
      await removeStoredUserData();

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = await getStoredToken();

      if (token) {
        const decoded = await verifyToken(token);

        if (decoded) {
          const userData = await getStoredUserData();

          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            await removeStoredToken();
          }
        } else {
          await removeStoredToken();
          await removeStoredUserData();
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
