import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthSession {
  studentName: string;
  sessionToken: string;
  keyId: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  session: AuthSession | null;
  isLoading: boolean;
  login: (studentName: string, accessCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "anwaar_session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verifyStoredSession = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored) as AuthSession;
        
        // Verify session with server
        const { data, error } = await supabase.functions.invoke('verify-session', {
          body: { sessionToken: parsed.sessionToken }
        });

        if (error || !data?.valid) {
          // Invalid session - clear it
          localStorage.removeItem(STORAGE_KEY);
          setIsAuthenticated(false);
          setSession(null);
        } else {
          // Valid session
          setSession(parsed);
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyStoredSession();
  }, []);

  const login = async (studentName: string, accessCode: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate access code with server-side edge function
      const { data, error } = await supabase.functions.invoke('validate-access', {
        body: { accessCode, studentName }
      });

      if (error) {
        console.error('Server validation error:', error.message);
        return { success: false, error: 'Validation failed. Please try again.' };
      }

      if (!data?.valid) {
        return { success: false, error: data?.error || 'Invalid access code' };
      }

      // Create session from server response
      const newSession: AuthSession = { 
        studentName: data.studentName,
        sessionToken: data.sessionToken,
        keyId: data.keyId || ''
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, session, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
