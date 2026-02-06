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
      className="relative py-24 px-4 overflow-hidden min-h-[700px] flex items-center justify-center bg-[url('/login-bg-optimized.png')] bg-fixed bg-cover bg-center bg-no-repeat"
    >
      {/* Mobile Optimization: Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Modern Glass Panel */}
        <div className="relative bg-[#1a1a1a]/40 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl p-8 md:p-10">

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

            {/* Header Row */}
            <div className="text-center space-y-1 mb-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Salaamu Calaykum!</h2>
              <p className="text-zinc-400 font-medium">Soo Galis</p>
            </div>

            {/* Inputs Container */}
            <div className="flex flex-col gap-4">

              {/* Student Name */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-emerald-500/80" />
                </div>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Magacaaga"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:bg-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
                  disabled={isLoading}
                  maxLength={100}
                />
              </div>

              {/* Access ID */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Key className="w-5 h-5 text-emerald-500/80" />
                </div>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Aqoonsigaaga (ID)"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:bg-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none font-mono tracking-wide"
                  disabled={isLoading}
                  maxLength={50}
                />
              </div>

              {/* Error Display */}
              {(errors.studentName || errors.accessCode) && (
                <p className="text-red-400 text-xs text-center font-medium bg-red-500/10 py-1 rounded">
                  {errors.studentName || errors.accessCode}
                </p>
              )}

            </div>

            {/* Action Row */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/10 backdrop-blur-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Soo Galis"
              )}
            </button>

            {/* Footer Row */}
            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-sm text-zinc-500">
                Ma lihid ID? <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">La xiriir Maamulka</a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
