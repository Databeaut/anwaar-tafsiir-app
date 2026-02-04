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
    <section
      id="login-section"
      className="relative py-24 px-4 overflow-hidden min-h-[700px] flex items-center justify-center bg-[url('/login-bg-optimized.png')] bg-cover bg-center bg-no-repeat"
    >
      {/* Mobile Optimization: Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            Gal <span className="text-emerald-400">Fasalka</span>
          </h2>
          <p className="text-gray-200 text-lg drop-shadow-md">
            Geli aqoonsigaaga si aad u bilowdo barashada
          </p>
        </div>

        {/* Optimized Glass Card */}
        <div className="relative group/card">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-[40px] p-8 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
          >
            {/* Student Name Input */}
            <div className="space-y-2 group/field transition-all duration-300">
              <label htmlFor="studentName" className="text-sm font-bold text-gray-300 group-focus-within/field:text-emerald-400 transition-colors flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 group-focus-within/field:text-emerald-500 transition-colors" />
                Magacaaga
              </label>
              <div className="relative group/input">
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Geli magacaaga..."
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 group-focus-within/input:border-emerald-500/50 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-10"
                  disabled={isLoading}
                  maxLength={100}
                />
                {/* External Neon Glow on Focus - CSS Only */}
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
              {errors.studentName && (
                <p className="text-red-400 text-sm mt-1">{errors.studentName}</p>
              )}
            </div>

            {/* Access Code Input */}
            <div className="space-y-2 group/field">
              <label htmlFor="accessCode" className="text-sm font-bold text-gray-300 group-focus-within/field:text-emerald-400 transition-colors flex items-center gap-2">
                <Key className="w-4 h-4 text-gray-400 group-focus-within/field:text-emerald-500 transition-colors" />
                Aqoonsiga Ardayga (ID)
              </label>
              <div className="relative group/input">
                <input
                  id="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Tusaale: 12345"
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 group-focus-within/input:border-emerald-500/50 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-300 font-mono tracking-wider relative z-10"
                  disabled={isLoading}
                  maxLength={50}
                />
                {/* External Neon Glow on Focus */}
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
              {errors.accessCode && (
                <p className="text-red-400 text-sm mt-1">{errors.accessCode}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sugaya...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>Gal Fasalka</span>
                </div>
              )}
            </button>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-400">
              Ma haysatid ID? <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors border-b border-transparent hover:border-emerald-400">La xiriir macalinka</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
