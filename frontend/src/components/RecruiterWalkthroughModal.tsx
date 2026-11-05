import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import type { Role } from "../types";

interface RecruiterWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecruiterWalkthroughModal({ isOpen, onClose }: RecruiterWalkthroughModalProps) {
  const { demoLogin, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const switchTo = async (role: Role, path: string) => {
    try {
      if (user?.role !== role) {
        await demoLogin(role);
        toast.success(`Switched to ${role} role`);
      }
      navigate(path);
      onClose();
    } catch {
      toast.error("Failed to switch role");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="walkthrough-title"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close walkthrough"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-sm">
            💡
          </span>
          <div>
            <h2 id="walkthrough-title" className="text-xl font-bold text-slate-900 sm:text-2xl">
              2-Minute Recruiter Walkthrough
            </h2>
            <p className="text-xs text-slate-500">
              How to test the full multi-tenant complaint lifecycle in 3 simple steps
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Step 1 */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Step 1: File an Issue as Customer</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Switch to <strong>Customer</strong> and submit a new ticket (e.g. &ldquo;Payment double charged&rdquo; with <strong>HIGH</strong> priority).
                    Notice the auto-generated ticket ID (`RX-XXXXXX`) and computed SLA deadline.
                  </p>
                </div>
              </div>
              <button
                onClick={() => switchTo("CUSTOMER", "/app/complaints/new")}
                className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition"
              >
                Go to File Issue &rarr;
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Step 2: Triage &amp; Resolve as Employee</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Switch to <strong>Employee</strong> (Asha Rao). Find the unassigned ticket in complaints, click <strong>&ldquo;Accept Complaint&rdquo;</strong> (atomic conditional update), change status to <strong>&ldquo;In Progress&rdquo;</strong>, and mark <strong>&ldquo;Resolved&rdquo;</strong> with a note.
                  </p>
                </div>
              </div>
              <button
                onClick={() => switchTo("EMPLOYEE", "/app/complaints")}
                className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Go to Queue &rarr;
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Step 3: Monitor Analytics &amp; SLAs as Admin</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Switch to <strong>Admin</strong>. Open the <strong>Analytics</strong> page to see real-time MongoDB aggregation pipelines update, view SLA compliance trends, employee resolution workloads, and the immutable audit log.
                  </p>
                </div>
              </div>
              <button
                onClick={() => switchTo("ADMIN", "/app/analytics")}
                className="shrink-0 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 transition"
              >
                Go to Analytics &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">
            Click <strong>&ldquo;Reset Data&rdquo;</strong> in the top bar anytime to return to the initial 45 sample complaints.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Got it, let&apos;s explore!
          </button>
        </div>
      </div>
    </div>
  );
}

