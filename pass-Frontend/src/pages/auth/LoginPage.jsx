import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/masterCalling/auth/authApi";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
        }
        navigate("/dashboard");
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full select-none">
      {/* Mobile Branding (Visible only on small viewports) */}
      <div className="lg:hidden mb-8">
        <h1 className="text-3xl font-extrabold tracking-wider text-primary">VMS</h1>
        <p className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5">Visitor Management System</p>
      </div>

      {/* Header Info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Sign in to your account</h1>
        <p className="text-sm text-slate-500 mt-2 font-normal leading-relaxed">
          Enter your authorized enterprise credentials to access the Visitor Management dashboard.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert-banner alert-danger animate-fade-in-up">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Info Banner */}
      {info && (
        <div className="alert-banner alert-info animate-fade-in-up">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{info}</div>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Email Address
          </label>
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200 shadow-sm">
            <Mail className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 font-medium outline-none"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Password
          </label>
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200 shadow-sm">
            <Lock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 font-medium outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-150 outline-none pr-1"
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Remember Me / Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1 select-none">
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-600 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 accent-primary"
            />
            <span>Remember this device</span>
          </label>
          <a
            href="#forgot-password"
            onClick={e => {
              e.preventDefault();
              setInfo("");
              setError("Please contact your IT administrator to reset your password.");
            }}
            className="text-primary hover:text-primary-hover font-semibold transition-colors duration-150"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-lg border-0 cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="loading-spinner w-4 h-4 border-2 border-white/30 border-t-white" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <span>Sign In to Dashboard</span>
          )}
        </button>
      </form>

      {/* Support footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400 font-normal">
          Authorized personnel only. Need help?{" "}
          <a
            href="#support"
            onClick={e => {
              e.preventDefault();
              setError("");
              setInfo("Please contact support at this email: uttamsantoki05@gmail.com");
            }}
            className="text-slate-500 hover:text-slate-700 underline font-medium transition-colors"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};
