import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { RecruiterWalkthroughModal } from "./RecruiterWalkthroughModal";
import type { Role } from "../types";

export function DemoBanner() {
  const { user, isDemo, demoLogin, demoReset, exitDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [switching, setSwitching] = useState<Role | null>(null);
  const [resetting, setResetting] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Show if isDemo flag is set or user belongs to demo-org
  const isDemoSession = isDemo || user?.email?.endsWith("@demo.com");
  if (!isDemoSession || !user) return null;

  const handleRoleSwitch = async (targetRole: Role) => {
    if (user.role === targetRole || switching) return;
    setSwitching(targetRole);
    try {
      await demoLogin(targetRole);
      toast.success(`Switched demo role to ${targetRole}`);
      navigate("/app");
    } catch {
      toast.error("Failed to switch role. Please retry.");
    } finally {
      setSwitching(null);
    }
  };

  const handleReset = async () => {
    if (resetting) return;
    setResetting(true);
    try {
      await demoReset();
      toast.success("Demo sample data has been reset to initial state");
      // Reload current route data
      window.location.reload();
    } catch {
      toast.error("Failed to reset demo data");
      setResetting(false);
    }
  };

  const handleExit = async () => {
    try {
      await exitDemo();
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-3 py-2 text-slate-800 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-xs">
          {/* Left: Demo badge & Org Info */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 font-bold text-amber-900 border border-amber-500/30">
              <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
              DEMO MODE
            </span>
            <span className="hidden text-slate-600 sm:inline">
              Org: <strong className="text-slate-800">Demo Telecom</strong> (Isolated Sandbox)
            </span>
          </div>

          {/* Center: Quick Role Switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-amber-200/50 p-1 border border-amber-300/60">
            <span className="hidden px-2 text-[11px] font-semibold uppercase tracking-wider text-amber-900 md:inline">
              Role:
            </span>

            {/* Customer Button */}
            <button
              onClick={() => handleRoleSwitch("CUSTOMER")}
              disabled={switching !== null}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition ${
                user.role === "CUSTOMER"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white/80 hover:text-slate-900"
              }`}
            >
              {switching === "CUSTOMER" ? (
                <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
              ) : (
                <span>👤</span>
              )}
              <span>Customer</span>
            </button>

            {/* Employee Button */}
            <button
              onClick={() => handleRoleSwitch("EMPLOYEE")}
              disabled={switching !== null}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition ${
                user.role === "EMPLOYEE"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white/80 hover:text-slate-900"
              }`}
            >
              {switching === "EMPLOYEE" ? (
                <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
              ) : (
                <span>🛠️</span>
              )}
              <span>Employee</span>
            </button>

            {/* Admin Button */}
            <button
              onClick={() => handleRoleSwitch("ADMIN")}
              disabled={switching !== null}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition ${
                user.role === "ADMIN"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white/80 hover:text-slate-900"
              }`}
            >
              {switching === "ADMIN" ? (
                <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
              ) : (
                <span>📊</span>
              )}
              <span>Admin</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Guide Button */}
            <button
              onClick={() => setGuideOpen(true)}
              className="flex items-center gap-1 rounded-md border border-amber-300 bg-white/90 px-2.5 py-1 font-medium text-amber-900 shadow-xs hover:bg-white transition"
              title="View 2-minute recruiter walkthrough"
            >
              <span>💡</span>
              <span className="hidden sm:inline">Recruiter Guide</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-1 rounded-md border border-amber-300 bg-white/90 px-2.5 py-1 font-medium text-amber-900 shadow-xs hover:bg-white disabled:opacity-50 transition"
              title="Reset sample data back to 45 clean demo records"
            >
              {resetting ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
              ) : (
                <span>🔄</span>
              )}
              <span className="hidden sm:inline">Reset Data</span>
            </button>

            {/* Exit Demo */}
            <button
              onClick={handleExit}
              className="rounded-md bg-slate-800 px-2.5 py-1 font-medium text-white hover:bg-slate-900 transition"
              title="Exit demo and return to home"
            >
              Exit Demo
            </button>
          </div>
        </div>
      </div>

      <RecruiterWalkthroughModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}

