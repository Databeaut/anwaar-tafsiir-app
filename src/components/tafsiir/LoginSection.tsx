import { useState } from "react";
import { User, Key, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Enhanced input validation schema with security patterns
const loginSchema = z.object({
  studentName: z.string()
    .trim()
    .min(1, "Magacaaga waa lagama maarmaan")
    .max(100, "Magacaagu waa inuu ka gaaban yahay 100 xaraf")
    .regex(/^[\p{L}\p{M}\s'-]+$/u, "Magacaaga waxa ku jira xaraf aan la aqbali karin"),
  accessCode: z.string()
    .trim()
    .min(1, "ID-ga waa lagama maarmaan")
    .max(50, "ID-ga waa inuu ka gaaban yahay 50 xaraf")
    .regex(/^[a-zA-Z0-9-_]+$/, "ID-ga waxa ku jira xaraf aan la aqbali karin"),
});

const LoginSection = () => {
  const [studentName, setStudentName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ studentName?: string; accessCode?: string }>({});
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const validation = loginSchema.safeParse({ studentName, accessCode });
    if (!validation.success) {
      const fieldErrors: { studentName?: string; accessCode?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === "studentName") fieldErrors.studentName = err.message;
        if (err.path[0] === "accessCode") fieldErrors.accessCode = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Use server-side validated login
      const result = await login(studentName.trim(), accessCode.trim());

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "ID-gaagu waa qalad",
          description: result.error || "Fadlan hubi ID-gaaga oo isku day mar kale.",
        });
        return;
      }

      // Success
      toast({
        title: `Soo dhawoow, ${studentName.trim()}!`,
        description: "Waad ku guuleysatay inaad gasho fasalka.",
      });

    } catch {
      toast({
        variant: "destructive",
        title: "Khalad",
        description: "Waxaa dhacay khalad. Fadlan isku day mar kale.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="login-section" className="relative py-20 px-4">
      <div className="max-w-md mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gal <span className="text-secondary">Fasalka</span>
          </h2>
          <p className="text-muted-foreground">
            Geli aqoonsigaaga si aad u bilowdo barashada
          </p>
        </div>

        {/* Login Card */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-secondary/20 to-emerald-500/20 rounded-2xl blur-xl opacity-50" />
          
          <form 
            onSubmit={handleSubmit}
            className="relative bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6"
          >
            {/* Student Name Input */}
            <div className="space-y-2">
              <label htmlFor="studentName" className="text-sm font-medium text-white/80 flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" />
                Magacaaga
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Geli magacaaga..."
                className={`w-full px-4 py-3 bg-white/5 border ${errors.studentName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all`}
                disabled={isLoading}
                maxLength={100}
              />
              {errors.studentName && (
                <p className="text-red-400 text-sm">{errors.studentName}</p>
              )}
            </div>

            {/* Access Code Input */}
            <div className="space-y-2">
              <label htmlFor="accessCode" className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Key className="w-4 h-4 text-secondary" />
                Aqoonsiga Ardayga (ID)
              </label>
              <input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Tusaale: 12345"
                className={`w-full px-4 py-3 bg-white/5 border ${errors.accessCode ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all font-mono tracking-wider`}
                disabled={isLoading}
                maxLength={50}
              />
              {errors.accessCode && (
                <p className="text-red-400 text-sm">{errors.accessCode}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-hero glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sugaya...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Gal Fasalka</span>
                </>
              )}
            </button>

            {/* Help Text */}
            <p className="text-center text-sm text-muted-foreground">
              Ma haysatid ID? La xiriir macalinka
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
