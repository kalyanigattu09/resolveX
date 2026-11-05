import { Types } from "mongoose";
import { AuditLog } from "../../models/AuditLog";
import { Comment } from "../../models/Comment";
import { CATEGORIES, Complaint, PRIORITIES, type Priority } from "../../models/Complaint";
import { Counter } from "../../models/Counter";
import { Department } from "../../models/Department";
import { Feedback } from "../../models/Feedback";
import { Notification } from "../../models/Notification";
import { Organization } from "../../models/Organization";
import { RefreshToken } from "../../models/RefreshToken";
import { SLAPolicy } from "../../models/SLAPolicy";
import { Role, toSafeUser, User } from "../../models/User";
import { DEFAULT_POLICIES } from "../sla/sla.service";
import { AuthResult, issueTokens } from "../auth/auth.service";
import { hashPassword } from "../../utils/password";
import { ApiError } from "../../utils/ApiError";

export const DEMO_ORG_SLUG = "demo-org";
export const DEMO_PASSWORD = "Demo1234";

const DAY_MS = 86_400_000;

const TITLES = [
  "Optical fiber connection drops intermittently during business hours",
  "Billing dispute: Double charge on invoice #INV-8921",
  "Unable to access enterprise portal following password reset",
  "Router gateway firmware freeze after latest firmware patch",
  "VoIP SIP trunk packet loss exceeding 18%",
  "Service activation delay after payment confirmation",
  "Hardware replacement request for defective modem",
  "API webhook latency spike on customer notification endpoint",
  "Unauthorized tariff plan change on primary account line",
  "Billing discrepancy on international roaming bundle",
  "Customer portal 500 error when downloading invoice PDF",
  "VPN tunnel drops every 30 minutes during high bandwidth usage",
];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function seedDemoData(complaintCount = 45): Promise<void> {
  const rand = rng(42);
  const pick = <T>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];
  const now = Date.now();

  let org = await Organization.findOne({ slug: DEMO_ORG_SLUG });
  if (org) {
    const orgId = org._id;
    await Promise.all([
      Comment.deleteMany({ organizationId: orgId }),
      Complaint.deleteMany({ organizationId: orgId }),
      Counter.deleteMany({ organizationId: orgId }),
      Department.deleteMany({ organizationId: orgId }),
      Feedback.deleteMany({ organizationId: orgId }),
      AuditLog.deleteMany({ organizationId: orgId }),
      Notification.deleteMany({ organizationId: orgId }),
      RefreshToken.deleteMany({ organizationId: orgId }),
      SLAPolicy.deleteMany({ organizationId: orgId }),
      User.deleteMany({ organizationId: orgId }),
    ]);
  } else {
    org = await Organization.create({
      name: "Demo Telecom (Live Demo)",
      slug: DEMO_ORG_SLUG,
    });
  }

  const organizationId = org._id;
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  // Departments
  const [billing, network] = await Department.create([
    { organizationId, name: "Billing & Accounts" },
    { organizationId, name: "Network Infrastructure" },
  ]);

  // SLA Policies
  for (const [p, policy] of Object.entries(DEFAULT_POLICIES)) {
    await SLAPolicy.create({
      organizationId,
      priority: p as Priority,
      responseMinutes: policy.responseMinutes,
      resolutionMinutes: policy.resolutionMinutes,
    });
  }

  // Users
  const admin = await User.create({
    organizationId,
    name: "Alex Vance (Admin)",
    email: "admin@demo.com",
    passwordHash,
    role: "ADMIN",
  });

  const employees = await User.create([
    {
      organizationId,
      name: "Asha Rao",
      email: "asha@demo.com",
      passwordHash,
      role: "EMPLOYEE",
      departmentId: network._id,
    },
    {
      organizationId,
      name: "Ben Carter",
      email: "ben@demo.com",
      passwordHash,
      role: "EMPLOYEE",
      departmentId: billing._id,
    },
    {
      organizationId,
      name: "Chitra Iyer",
      email: "chitra@demo.com",
      passwordHash,
      role: "EMPLOYEE",
      departmentId: network._id,
    },
  ]);

  const customers = await User.create([
    { organizationId, name: "Sarah Connor", email: "customer1@demo.com", passwordHash, role: "CUSTOMER" },
    { organizationId, name: "Marcus Wright", email: "customer2@demo.com", passwordHash, role: "CUSTOMER" },
    { organizationId, name: "Elena Rostova", email: "customer3@demo.com", passwordHash, role: "CUSTOMER" },
    { organizationId, name: "David Kim", email: "customer4@demo.com", passwordHash, role: "CUSTOMER" },
    { organizationId, name: "Maya Patel", email: "customer5@demo.com", passwordHash, role: "CUSTOMER" },
  ]);

  const complaints: Record<string, unknown>[] = [];
  const feedbacks: Record<string, unknown>[] = [];

  for (let i = 0; i < complaintCount; i++) {
    const _id = new Types.ObjectId();
    const created = new Date(now - rand() * 30 * DAY_MS);
    const priority = pick(PRIORITIES);
    const policy = DEFAULT_POLICIES[priority];
    const due = new Date(created.getTime() + policy.resolutionMinutes * 60_000);
    const employee = pick(employees);
    const customer = pick(customers);
    const roll = rand();
    const history: Record<string, unknown>[] = [{ status: "OPEN", by: customer._id, at: created }];

    let status = "OPEN";
    let assignedTo: Types.ObjectId | null = null;
    let resolvedAt: Date | undefined;
    let closedAt: Date | undefined;
    let firstRespondedAt: Date | undefined;
    let resolutionNote: string | undefined;

    if (roll < 0.20) {
      // Unassigned OPEN ticket (prime for employee to claim during demo!)
      status = "OPEN";
      assignedTo = null;
    } else if (roll < 0.40) {
      // ASSIGNED to employee
      status = "ASSIGNED";
      assignedTo = employee._id;
      history.push({ status: "ASSIGNED", by: admin._id, at: new Date(created.getTime() + 60_000) });
    } else if (roll < 0.65) {
      // IN_PROGRESS
      status = "IN_PROGRESS";
      assignedTo = employee._id;
      firstRespondedAt = new Date(created.getTime() + 10 * 60_000);
      history.push(
        { status: "ASSIGNED", by: admin._id, at: new Date(created.getTime() + 60_000) },
        { status: "IN_PROGRESS", by: employee._id, at: firstRespondedAt, note: "Investigating network telemetry" }
      );
    } else {
      // RESOLVED or CLOSED
      assignedTo = employee._id;
      firstRespondedAt = new Date(created.getTime() + rand() * policy.responseMinutes * 60_000);
      const resolveTime = created.getTime() + policy.resolutionMinutes * 60_000 * (0.2 + rand() * 0.9);
      resolvedAt = new Date(Math.min(resolveTime, now - 60_000));
      status = roll < 0.85 ? "RESOLVED" : "CLOSED";
      resolutionNote = "Identified faulty gateway routing table. Reset trunk profile and verified latency normalized.";
      if (status === "CLOSED") closedAt = new Date(Math.min(resolvedAt.getTime() + DAY_MS, now));

      history.push(
        { status: "ASSIGNED", by: admin._id, at: new Date(created.getTime() + 60_000) },
        { status: "IN_PROGRESS", by: employee._id, at: firstRespondedAt },
        { status: "RESOLVED", by: employee._id, at: resolvedAt, note: resolutionNote }
      );
      if (closedAt) history.push({ status: "CLOSED", by: customer._id, at: closedAt });

      if (rand() < 0.6) {
        feedbacks.push({
          _id: new Types.ObjectId(),
          organizationId,
          complaintId: _id,
          customerId: customer._id,
          rating: 3 + Math.floor(rand() * 3), // 3-5 stars
          comment: "Issue was resolved quickly by the engineering support team.",
          createdAt: new Date(Math.min(resolvedAt.getTime() + 3_600_000, now)),
        });
      }
    }

    const active = !resolvedAt;
    const isEscalated = active && due.getTime() < now;

    complaints.push({
      _id,
      organizationId,
      ticketNo: `RX-${String(i + 1).padStart(6, "0")}`,
      title: pick(TITLES),
      description: "[DEMO DATA] Pre-populated sample complaint to demonstrate ResolveX triage, SLA tracking, and resolution lifecycle.",
      category: pick(CATEGORIES),
      priority,
      status,
      customerId: customer._id,
      assignedTo,
      departmentId: assignedTo ? employee.departmentId : null,
      attachments: [],
      firstResponseDueAt: new Date(created.getTime() + policy.responseMinutes * 60_000),
      resolutionDueAt: due,
      ...(firstRespondedAt ? { firstRespondedAt } : {}),
      ...(resolvedAt ? { resolvedAt, resolutionNote } : {}),
      ...(closedAt ? { closedAt } : {}),
      isEscalated,
      ...(isEscalated ? { escalatedAt: new Date(due.getTime() + 60_000) } : {}),
      escalationHistory: isEscalated
        ? [{ at: new Date(due.getTime() + 60_000), reason: "SLA resolution deadline exceeded", level: 1 }]
        : [],
      reopenCount: 0,
      statusHistory: history,
      createdAt: created,
      updatedAt: resolvedAt ?? created,
    });
  }

  await Complaint.collection.insertMany(complaints);
  if (feedbacks.length) await Feedback.collection.insertMany(feedbacks);
  await Counter.create({ organizationId, key: "complaint", seq: complaintCount });
  await Complaint.init();
}

export async function ensureDemoData(): Promise<void> {
  const org = await Organization.findOne({ slug: DEMO_ORG_SLUG });
  if (!org) {
    await seedDemoData();
    return;
  }
  const count = await Complaint.countDocuments({ organizationId: org._id });
  if (count === 0) {
    await seedDemoData();
  }
}

export async function getDemoLogin(role: Role): Promise<AuthResult> {
  await ensureDemoData();
  const org = await Organization.findOne({ slug: DEMO_ORG_SLUG });
  if (!org) throw new ApiError(500, "Failed to initialize demo organization");

  let email = "customer1@demo.com";
  if (role === "ADMIN") email = "admin@demo.com";
  else if (role === "EMPLOYEE") email = "asha@demo.com";

  const user = await User.findOne({ organizationId: org._id, email });
  if (!user) throw ApiError.notFound(`Demo user for role ${role} not found`);

  const safeUser = toSafeUser(user);
  const tokens = await issueTokens(safeUser);
  return { user: safeUser, ...tokens };
}
