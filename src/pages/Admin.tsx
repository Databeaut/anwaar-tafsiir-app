import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Send, Key, Clock, User } from "lucide-react";
import AdminDashboard from "@/components/AdminDashboard";

interface RecentKey {
  student_name: string;
  access_code: string;
  created_at: string;
}

const ADMIN_STORAGE_KEY = "anwaar_admin_session";

const Admin = () => {
  const { toast } = useToast();

  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");



  // Check for existing admin session on mount
  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.authenticated) {
          setIsAdminAuthenticated(true);
          setAdminCredentials({ username: parsed.username, password: parsed.password });
        }
      } catch {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }
  }, []);

  const handleAdminLogin = async () => {
    setAuthError("");

    if (!adminCredentials.username || !adminCredentials.password) {
      setAuthError("Please enter both username and password");
      return;
    }

    try {
      // Verify credentials via secure edge function (not direct database query)
      const { data, error } = await supabase.functions.invoke('admin-login', {
        body: {
          username: adminCredentials.username,
          password: adminCredentials.password
        }
      });

      if (error || !data?.success) {
        setAuthError("Xogtaada waa khalad"); // Invalid credentials
        return;
      }

      // Store session with the secure token from server
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({
        authenticated: true,
        username: data.username,
        sessionToken: data.sessionToken
      }));

      setIsAdminAuthenticated(true);
    } catch (err) {
      console.error('Login error:', err);
      setAuthError("Wax khalad ah ayaa dhacay");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAdminAuthenticated(false);
    setAdminCredentials({ username: "", password: "" });
  };

  // Admin Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-b from-[#1a1a1a] to-[#141414] border-white/10 rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
            <p className="text-muted-foreground text-sm">Geli aqoonsigaaga si aad u gasho</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground">Username</Label>
              <Input
                id="username"
                type="text"
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter password"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm text-center font-medium">{authError}</p>
            )}
            <Button
              onClick={handleAdminLogin}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminDashboard />
    </div>
  );
};

export default Admin;
