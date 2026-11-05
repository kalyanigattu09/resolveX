import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { Role } from "../types";

interface DemoLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoLauncherModal({ isOpen, onClose }: DemoLauncherModalProps) {
  const { demoLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);

  if (!isOpen) return null;

  const handleLaunch = async (role: Role) => {
    setLoadingRole(role);
    try {
      await demoLogin(role);
      toast.success(`Entered Live Demo as ${role}`);
      onClose();
      navigate("/app");
    } catch {
      toast.error("Failed to launch demo. Please check that the backend server is running.");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close demo modal"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
            Recruiter &amp; Reviewer Sandbox
          </div>
          <h2 id="demo-modal-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Explore ResolveX Live Demo
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Experience the complete complaint &amp; service management lifecycle with realistic pre-populated data.
            Zero sign-up or credentials required.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Customer Card */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-brand-300 hover:bg-brand-50/20 hover:shadow-md">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mt-3 font-semibold text-slate-900">Customer Demo</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                File new issues, track real-time SLA countdown timers, and view resolution history.
              </p>
            </div>
            <button
              onClick={() => handleLaunch("CUSTOMER")}
              disabled={loadingRole !== null}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50 hover:text-brand-600 disabled:opacity-50 transition"
            >
              {loadingRole === "CUSTOMER" ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                  Loading...
                </span>
              ) : (
                <>Launch as Customer &rarr;</>
              )}
            </button>
          </div>

          {/* Employee Card */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-brand-300 hover:bg-brand-50/20 hover:shadow-md">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-3 font-semibold text-slate-900">Employee Demo</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Triage open queues, atomically claim tickets, update progression, and write resolution notes.
              </p>
            </div>
            <button
              onClick={() => handleLaunch("EMPLOYEE")}
              disabled={loadingRole !== null}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50 hover:text-brand-600 disabled:opacity-50 transition"
            >
              {loadingRole === "EMPLOYEE" ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                  Loading...
                </span>
              ) : (
                <>Launch as Employee &rarr;</>
              )}
            </button>
          </div>

          {/* Admin Card */}
          <div className="flex flex-col justify-between rounded-xl border border-brand-200 bg-brand-50/40 p-5 shadow-sm transition hover:border-brand-400 hover:bg-brand-50/70 hover:shadow-md">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <h3 className="font-semibold text-slate-900">Admin Demo</h3>
                <span className="rounded bg-brand-200/80 px-1.5 py-0.5 text-[10px] font-bold text-brand-900">RECOMMENDED</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Full analytics suite, SLA escalation compliance, team workload, department controls, and immutable audit logs.
              </p>
            </div>
            <button
              onClick={() => handleLaunch("ADMIN")}
              disabled={loadingRole !== null}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 transition"
            >
              {loadingRole === "ADMIN" ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Loading...
                </span>
              ) : (
                <>Launch as Admin &rarr;</>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Safe sandbox: All data isolated to <strong>demo-org</strong>. You can switch roles anytime from the top bar.</span>
          </div>
          <button
            onClick={onClose}
            className="font-medium text-slate-600 hover:text-slate-900 underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

