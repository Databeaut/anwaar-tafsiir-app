import { useState, useRef } from "react";
import { User, Key, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

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

  // 3D TILT LOGIC
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize mouse position (-0.5 to 0.5)
    // ClientX relative to card center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
      className="relative py-24 px-4 bg-[#0a0f1c] overflow-hidden min-h-[700px] flex items-center justify-center perspective-[1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Dynamic Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen opacity-20 blur-xl"
            style={{
              background: i % 2 === 0 ? 'radial-gradient(circle, rgba(16,185,129,0.8) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(20,184,166,0.8) 0%, rgba(0,0,0,0) 70%)',
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Floating Arabic Calligraphy - Bobbing Animation */}
        <div className="absolute inset-0 font-arabic select-none pointer-events-none">
          <motion.span
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] text-7xl text-emerald-500/10"
          >
            اقرأ
          </motion.span>
          <motion.span
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-[15%] text-5xl text-teal-500/10"
          >
            علم
          </motion.span>
          <motion.span
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 8, delay: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 left-[20%] text-6xl text-emerald-400/10"
          >
            نور
          </motion.span>
        </div>
      </div>

      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-10 translate-z-[50px]">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            Gal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Fasalka</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Geli aqoonsigaaga si aad u bilowdo barashada
          </p>
        </div>

        {/* 3D Glass Card */}
        <div className="relative group/card">
          {/* Outer Glow */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-3xl blur-md opacity-0 group-hover/card:opacity-100 transition duration-700"
            style={{ transform: "translateZ(-10px)" }}
          />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform preserve-3d"
          >
            {/* Student Name Input */}
            <div className="space-y-2 group/field transform transition-all duration-300">
              <label htmlFor="studentName" className="text-sm font-bold text-slate-400 group-focus-within/field:text-emerald-400 transition-colors flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500 group-focus-within/field:text-emerald-500 transition-colors" />
                Magacaaga
              </label>
              <div className="relative group/input">
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Geli magacaaga..."
                  className="w-full px-5 py-4 bg-[#0F1623] border border-white/5 group-focus-within/input:border-emerald-500/50 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-10"
                  disabled={isLoading}
                  maxLength={100}
                />
                {/* External Neon Glow on Focus */}
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
              {errors.studentName && (
                <p className="text-red-400 text-sm mt-1">{errors.studentName}</p>
              )}
            </div>

            {/* Access Code Input */}
            <div className="space-y-2 group/field">
              <label htmlFor="accessCode" className="text-sm font-bold text-slate-400 group-focus-within/field:text-emerald-400 transition-colors flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-500 group-focus-within/field:text-emerald-500 transition-colors" />
                Aqoonsiga Ardayga (ID)
              </label>
              <div className="relative group/input">
                <input
                  id="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Tusaale: 12345"
                  className="w-full px-5 py-4 bg-[#0F1623] border border-white/5 group-focus-within/input:border-emerald-500/50 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-300 font-mono tracking-wider relative z-10"
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
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95, y: 2 }}
              className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg py-4 rounded-xl shadow-[0_4px_0_rgb(16,117,105)] active:shadow-none hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            </motion.button>

            {/* Help Text */}
            <p className="text-center text-sm text-slate-500">
              Ma haysatid ID? <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors border-b border-transparent hover:border-emerald-400">La xiriir macalinka</a>
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginSection;
