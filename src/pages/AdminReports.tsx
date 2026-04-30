import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  AlertTriangle,
  ShieldCheck,
  EyeOff,
  Search,
  X,
  Menu,
  Loader,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import AdminSidebar from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { openAdminSidebar, openSignoutModal } from "@/redux/action";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: any;
  lastGenerated?: string;
  status: "Ready" | "Processing" | "Active";
}

interface ReportSource {
  type: string;
  value: string;
}

interface SecurityAction {
  id: string;
  label: string;
  variant: "outline" | "secondary" | "destructive";
  feedback: string;
  statusUpdate?: ReportData["status"];
}

interface ReportData {
  id: number;
  categoryId: string;
  name: string;
  type: string;
  generated: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In review" | "Resolved";
  note: string;
  sources: ReportSource[];
  risks: string[];
  fixes: string[];
  actions: SecurityAction[];
}

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedType, setSelectedType] = useState("all");
  const dispatch = useDispatch();
  const isOpen = useSelector((state:any) => state.sidebar.adminSidebar);
  const signOutModal = useSelector((state:any) => state.signout);
  const { toast } = useToast();

  const [reportTypes, setReportTypes] = useState<ReportType[]>([
    {
      id: "fraud",
      title: "Fraud Attempts",
      description: "Monitor suspicious payment and transaction behavior.",
      icon: AlertTriangle,
      status: "Active",
    },
    {
      id: "hacking",
      title: "Hacking Attempts",
      description: "Detect unauthorized access and intrusion attempts.",
      icon: ShieldCheck,
      status: "Active",
    },
    {
      id: "fake_accounts",
      title: "Fake Accounts",
      description: "Spot fraudulent or duplicate account creation.",
      icon: EyeOff,
      status: "Active",
    },
    {
      id: "suspicious_activity",
      title: "Suspicious Activity",
      description: "Track unusual user behavior across the platform.",
      icon: Search,
      status: "Active",
    },
    {
      id: "security_audit",
      title: "Security Audits",
      description: "Run regular system and data protection audits.",
      icon: ShieldCheck,
      status: "Active",
    },
  ]);
  const [recentReports, setRecentReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());

  const findings: Record<
    string,
    {
      severity: "Critical" | "High" | "Medium" | "Low";
      status: "Open" | "In review" | "Resolved";
      note: string;
      sources: ReportSource[];
      risks: string[];
      fixes: string[];
      actions: SecurityAction[];
    }
  > = {
    fraud: {
      severity: "Critical",
      status: "Open",
      note: "Automated fraud systems flagged high-risk payment abuse from a verified account.",
      sources: [
        { type: "User Account", value: "johndoe@example.com (User ID: 1023)" },
        { type: "IP Address", value: "203.0.113.45" },
        { type: "Transaction Log", value: "Failed payment attempts over threshold" },
      ],
      risks: [
        "Repeated failed charges and synthetic identity indicator.",
        "Multiple high-value transactions from a single account.",
        "Potential financial loss and chargeback risk.",
      ],
      fixes: [
        "Freeze the account until fraud investigation completes.",
        "Verify payment details and transaction origin.",
        "Monitor connected IP and device signals closely.",
      ],
      actions: [
        {
          id: "block-ip",
          label: "Block IP",
          variant: "destructive",
          feedback: "IP address has been blocked from new sessions.",
          statusUpdate: "In review",
        },
        {
          id: "suspend-account",
          label: "Suspend Account",
          variant: "secondary",
          feedback: "Account suspended pending fraud review.",
          statusUpdate: "In review",
        },
      ],
    },
    hacking: {
      severity: "Critical",
      status: "Open",
      note: "Suspicious access patterns were detected in the admin and developer login flow.",
      sources: [
        { type: "IP Address", value: "198.51.100.22" },
        { type: "User Account", value: "admin@example.com" },
        { type: "Access Log", value: "Suspicious admin login sequence" },
      ],
      risks: [
        "Unauthorized access to sensitive controls.",
        "Privilege escalation attempts from unknown IPs.",
        "Potential system compromise if not contained.",
      ],
      fixes: [
        "Force password resets on impacted administrator accounts.",
        "Require multi-factor authentication on all privileged accounts.",
        "Block suspicious IP ranges and verify their origin.",
      ],
      actions: [
        {
          id: "enforce-mfa",
          label: "Enforce MFA",
          variant: "secondary",
          feedback: "MFA enforcement has been flagged for this account.",
          statusUpdate: "In review",
        },
        {
          id: "block-suspicious-ip",
          label: "Block IP",
          variant: "destructive",
          feedback: "Suspicious IP address has been blocked.",
          statusUpdate: "In review",
        },
      ],
    },
    fake_accounts: {
      severity: "High",
      status: "Open",
      note: "A cluster of unverified accounts show disposable email and repeated device fingerprints.",
      sources: [
        { type: "User Account", value: "tempuser1234@example.com" },
        { type: "Email Service", value: "Disposable email detected" },
        { type: "Device ID", value: "Device fingerprint mismatch" },
      ],
      risks: [
        "Fraudulent accounts may be used for reputation abuse.",
        "Duplicate identity signals can harm platform trust.",
        "Unverified accounts may bypass normal compliance checks.",
      ],
      fixes: [
        "Require identity verification for accounts flagged as suspicious.",
        "Block disposable email domains and device-id reuse.",
        "Perform daily cleanup of confirmed fake profiles.",
      ],
      actions: [
        {
          id: "flag-fake",
          label: "Flag Accounts",
          variant: "secondary",
          feedback: "Suspected fake accounts have been flagged for manual review.",
        },
        {
          id: "delete-fake",
          label: "Delete Profiles",
          variant: "destructive",
          feedback: "Confirmed fake profiles are ready for removal.",
          statusUpdate: "In review",
        },
      ],
    },
    suspicious_activity: {
      severity: "Medium",
      status: "Open",
      note: "Unusual behavior was detected on user accounts and transaction flow.",
      sources: [
        { type: "User Account", value: "janedoe@example.com" },
        { type: "IP Address", value: "203.0.113.99" },
        { type: "Behavior Log", value: "Unusual transaction pattern" },
      ],
      risks: [
        "Rapid changes to payout or contact details.",
        "Unexpected geolocation access patterns.",
        "High-frequency messaging or transactions.",
      ],
      fixes: [
        "Temporarily review and approve suspicious transactions.",
        "Alert users of unusual account activity.",
        "Verify account changes before applying them.",
      ],
      actions: [
        {
          id: "review-behavior",
          label: "Review Behavior",
          variant: "outline",
          feedback: "Behavior patterns have been sent to the security team.",
        },
        {
          id: "suspend-transactions",
          label: "Suspend Transactions",
          variant: "secondary",
          feedback: "Suspicious transactions are temporarily suspended.",
          statusUpdate: "In review",
        },
      ],
    },
    security_audit: {
      severity: "Low",
      status: "Open",
      note: "Regular security audit items require follow-up from the development team.",
      sources: [
        { type: "Audit Log", value: "Quarterly security review" },
        { type: "Access Control", value: "Permission review overdue" },
        { type: "Partner Assessment", value: "Third-party security check" },
      ],
      risks: [
        "Weak password policy across the system.",
        "Lack of recent data access reviews.",
        "No recent audit of partner security controls.",
      ],
      fixes: [
        "Enforce stronger password and session policies.",
        "Perform regular data access and permissions audits.",
        "Schedule third-party security reviews quarterly.",
      ],
      actions: [
        {
          id: "schedule-audit",
          label: "Schedule Audit",
          variant: "secondary",
          feedback: "Audit has been scheduled for the security team.",
          statusUpdate: "In review",
        },
        {
          id: "review-access",
          label: "Review Access",
          variant: "outline",
          feedback: "Access control and permissions are being reviewed.",
        },
      ],
    },
  };

  const handleActionClick = (reportId: number, action: SecurityAction) => {
    setRecentReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: action.statusUpdate || report.status,
            }
          : report
      )
    );

    toast({
      title: action.label,
      description: action.feedback,
    });
  };

  const refreshSecurityFindings = () => {
    try {
      setLoading(true);
      const generatedAt = new Date().toLocaleString();

      setReportTypes((prev) =>
        prev.map((report) => ({
          ...report,
          status: "Active",
          lastGenerated: generatedAt,
        }))
      );

      const selectedIds = selectedType === "all" ? Object.keys(findings) : [selectedType];
      const freshReports = selectedIds.map((reportTypeId) => {
        const reportType = reportTypes.find((r) => r.id === reportTypeId);
        const selectedFindings = findings[reportTypeId] || {
          severity: "Low" as const,
          status: "Open" as const,
          note: "General platform monitoring is active.",
          sources: [{ type: "System", value: "General security logs" }],
          risks: ["General system exposure detected."],
          fixes: ["Review system logs and apply security patches."],
          actions: [
            {
              id: "run-review",
              label: "Run Review",
              variant: "secondary",
              feedback: "General security review started.",
            },
          ],
        };

        return {
          id: Date.now() + Math.random(),
          categoryId: reportTypeId,
          name: reportType?.title || "Security Alert",
          type: reportType?.title || "Security",
          severity: selectedFindings.severity,
          status: selectedFindings.status,
          note: selectedFindings.note,
          generated: generatedAt,
          sources: selectedFindings.sources,
          risks: selectedFindings.risks,
          fixes: selectedFindings.fixes,
          actions: selectedFindings.actions,
        } as ReportData;
      });

      setRecentReports(freshReports);
      setLastUpdated(generatedAt);
      setError(null);
    } catch (err: any) {
      console.error("Error refreshing security findings:", err);
      setError(err?.message || "Unable to refresh security findings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSecurityFindings();
    const interval = window.setInterval(refreshSecurityFindings, 120000);
    return () => window.clearInterval(interval);
  }, [selectedPeriod, selectedType]);

  const displayedReports =
    selectedType === "all"
      ? recentReports
      : recentReports.filter((report) => report.categoryId === selectedType);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={'/'}><img src={Logo} alt="" /></Link>
        </div>
        <button
          onClick={() => dispatch(openAdminSidebar(!isOpen))}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <AdminSidebar active={"reports"} />
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
            <div className="flex items-start justify-between flex-col md:flex-row md:items-center gap-4 md:gap-0">
              <div className="flex items-center space-x-4 ">
                <div>
                  <h1 className="md:text-2xl font-bold text-gray-900">
                    Security Monitoring
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Monitor fraud, hacking, fake accounts, suspicious activity, and audit security regularly.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Auto-updating monitoring is active 24/7. Latest refresh: {lastUpdated}.
                  </p>
                </div>
              </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading reports...</span>
            </div>
          ) : (
            <>
              {displayedReports.some((report) => report.severity === "Critical") && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <p className="font-semibold">Critical breach detected.</p>
                  <p>
                    One or more issues require immediate action from the security and development team.
                  </p>
                </div>
              )}

              <div className="grid gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active Issues</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{displayedReports.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Critical Alerts</p>
                  <p className="mt-3 text-3xl font-semibold text-rose-700">
                    {displayedReports.filter((report) => report.severity === "Critical").length}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Warnings</p>
                  <p className="mt-3 text-3xl font-semibold text-amber-700">
                    {displayedReports.filter((report) => report.severity === "High" || report.severity === "Medium").length}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Last Refresh</p>
                  <p className="mt-3 text-sm font-medium text-slate-900">{lastUpdated}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {displayedReports.length ? (
                  displayedReports.map((report) => (
                    <Card key={report.id} className="shadow-sm border-slate-200">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{report.type}</p>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">{report.name}</h3>
                            <p className="mt-1 text-sm text-slate-600">{report.note}</p>
                          </div>
                          <div className="space-y-2 text-right">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              report.severity === "Critical"
                                ? "bg-rose-100 text-rose-700"
                                : report.severity === "High"
                                ? "bg-amber-100 text-amber-700"
                                : report.severity === "Medium"
                                ? "bg-sky-100 text-sky-700"
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {report.severity}
                            </span>
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {report.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-900 mb-2">Issue Sources</p>
                          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            {report.sources.map((source, idx) => (
                              <li key={`source-${report.id}-${idx}`}>
                                <span className="font-medium">{source.type}:</span> {source.value}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl bg-white p-4 border border-slate-200">
                            <p className="text-sm font-semibold text-slate-900 mb-2">Key Risks</p>
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                              {report.risks.map((risk, idx) => (
                                <li key={`risk-${report.id}-${idx}`}>{risk}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-2xl bg-white p-4 border border-slate-200">
                            <p className="text-sm font-semibold text-slate-900 mb-2">Fix Guidance</p>
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                              {report.fixes.map((fix, idx) => (
                                <li key={`fix-${report.id}-${idx}`}>{fix}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-amber-50 p-4 border border-amber-200">
                          <p className="text-sm font-semibold text-amber-900 mb-2">Admin Warning</p>
                          <p className="text-sm text-amber-700">
                            This issue should be reviewed by the security admin team before the next deployment.
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {report.actions.map((action) => (
                            <Button
                              key={action.id}
                              variant={action.variant}
                              onClick={() => handleActionClick(report.id, action)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed border-slate-300 bg-slate-50">
                    <CardContent className="p-6 text-center text-slate-600">
                      No active security issues right now. Monitoring is active and will show alerts as they appear.
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default AdminReports;
