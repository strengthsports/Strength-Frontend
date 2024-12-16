import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {BASE_URL} from '@env'
import { ToastAndroid } from "react-native";


interface User {
  id: string;
  email: string;
  [key: string]: any; // Additional properties if necessary
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  error: string | null;
  msgBackend: string | null;
  status: number | null; // Status code from the backend
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msgBackend, setMsgBackend] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null); // State for status code

  useEffect(() => {
    // Optionally handle session loading or persistence here
    const loadSession = async () => {
      console.log("No SecureStore logic applied.");
      console.log("Base URL:", BASE_URL);

    };

    loadSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setStatus(null);
      setMsgBackend(null)

      // const response = await fetch("http://192.168.157.28:3000/api/v1/login", {
        const response = await fetch(`${BASE_URL}/api/v1/login`, {
          method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setStatus(response.status); // Set the status code
      setMsgBackend(data.message); // Set the status code
      console.log("MsgBackend:", );

      ToastAndroid.show(data.message, ToastAndroid.SHORT);

      if (response.ok) {
        console.log("Login successful!");
        // ToastAndroid.show('Login successful!', ToastAndroid.SHORT);
        console.log("Full response:", data);
        console.log("Base URL:", process.env.REACT_APP_BASE_URL);

        setUser(data.data.user); // Assuming the user object comes from the backend
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        throw new Error(data.message || "Login failed. Please try again.")
      }
    } catch (err: any) {
      setIsLoggedIn(false);
      setError(err.message || "Something went wrong. Please try again.");
      console.error("Login failed:", err.message);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoggedIn(false);
      setUser(null);
      setStatus(null); // Reset status on logout
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        error,
        status,
        msgBackend,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
