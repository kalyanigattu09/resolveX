import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DemoLauncherModal } from "../../components/DemoLauncherModal";

const FEATURES = [
  { title: "One place for every complaint", text: "Customers submit and track issues. Teams stop chasing emails and spreadsheets." },
  { title: "Deadlines that enforce themselves", text: "Set response and resolution targets per priority. Overdue complaints are escalated automatically, exactly once." },
  { title: "Live updates", text: "Assignments, replies and escalations appear instantly through real-time notifications." },
  { title: "Private by design", text: "Every organization is isolated. Role-based access is enforced on the server, and every change is audit-logged." },
  { title: "Analytics that matter", text: "Resolution rate, average resolution time, SLA compliance and workload per employee." },
  { title: "Built for teams", text: "Customers, employees and admins each get a dashboard made for their job." },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white shadow-sm">R</span>
          <span className="text-lg font-semibold text-slate-900 tracking-tight">ResolveX</span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          {/* Header Demo Button */}
          <button
            onClick={() => setDemoOpen(true)}
            className="group flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50/70 px-3 py-1.5 font-medium text-brand-700 hover:bg-brand-100/80 transition"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white shadow-xs group-hover:scale-110 transition-transform">
              <svg className="h-2.5 w-2.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span>Live Demo</span>
          </button>

          {user ? (
            <Link className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 transition" to="/app">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link className="font-medium text-slate-600 hover:text-slate-900 transition" to="/login">
                Sign in
              </Link>
              <Link className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 shadow-sm transition" to="/register">
                Create workspace
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-5 pb-16 pt-14 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
          Multi-Tenant SLA &amp; Service Management
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Resolve complaints before they become churn
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 leading-relaxed">
          ResolveX gives every organization a private workspace to receive, assign and resolve customer complaints,
          with SLA countdowns, automated escalation, and real-time operational analytics built in.
        </p>

        {/* Hero Actions Group */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* Prominent Explore Live Demo Button */}
          <button
            onClick={() => setDemoOpen(true)}
            className="group relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs group-hover:scale-110 transition-transform">
              <svg className="h-3 w-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-base tracking-wide">Explore Live Demo</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium tracking-normal text-brand-100">
              No sign-up
            </span>
          </button>

          <Link
            to="/register"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition"
          >
            Create workspace
          </Link>
          <Link
            to="/login"
            className="rounded-xl px-4 py-3.5 font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Sign in &rarr;
          </Link>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Customer, Employee &amp; Admin roles
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Pre-seeded with 45 sample records
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Isolated multi-tenant sandbox
          </span>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200/60 py-8 text-center text-sm text-slate-500">
        ResolveX &middot; Intelligent Complaint &amp; Service Management Platform
      </footer>

      {/* Recruiter / Reviewer Demo Modal */}
      <DemoLauncherModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
