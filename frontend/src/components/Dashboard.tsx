import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ExternalLink,
  GitBranch,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  FileCode2,
  Terminal,
  Activity,
  Layers,
  RefreshCw,
  ArrowUpRight,
  GitCommit,
  Minus,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Assessment, Job, Evidence, SkillVerdict } from '../lib/types';

interface DashboardProps {
  assessment: Assessment | null;
  job: Job | null;
  onSimulatePush: (action: 'add_sql' | 'delete_sql') => void;
  isSimulating: boolean;
  onOpenCodeDefense: (evidenceId: string) => void;
}

const fadeUp: any = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'demonstrated':
      return {
        label: 'Demonstrated',
        icon: CheckCircle2,
        className: 'status-demonstrated',
        dot: '#4ADE80',
      };
    case 'partially_demonstrated':
      return {
        label: 'Partial',
        icon: AlertTriangle,
        className: 'status-partial',
        dot: '#FCD34D',
      };
    case 'not_demonstrated_in_reviewed_scope':
      return {
        label: 'Not in Scope',
        icon: XCircle,
        className: 'status-not-demonstrated',
        dot: '#F87171',
      };
    default:
      return {
        label: 'Unable to Assess',
        icon: HelpCircle,
        className: 'status-unable',
        dot: '#93C5FD',
      };
  }
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = getStatusConfig(status);
  const Icon = cfg.icon;
  return (
    <span className={`status-pill ${cfg.className}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: boolean;
  i: number;
}> = ({ label, value, sub, accent, i }) => (
  <motion.div
    custom={i}
    initial="hidden"
    animate="show"
    variants={fadeUp}
    className="metric-card"
  >
    <p className="metric-label">{label}</p>
    <div className={`metric-number ${accent ? 'text-[#E8C547]' : ''}`}>{value}</div>
    {sub && <div className="text-[11px] text-[#52525B] font-mono">{sub}</div>}
  </motion.div>
);

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border border-[#E8C547]/10" />
      <div className="absolute inset-0 rounded-full border-t border-[#E8C547]/60 animate-spin" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-[#A1A1AA]">Syncing repository snapshot</p>
      <p className="text-xs text-[#52525B] font-mono mt-1">Fetching verdicts & evidence…</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  assessment,
  job,
  onSimulatePush,
  isSimulating,
  onOpenCodeDefense,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!assessment || !job) return <LoadingState />;

  const verdicts = assessment.verdicts || [];
  const evidences = assessment.evidence || [];
  const demonstratedCount = verdicts.filter((v) => v.status === 'demonstrated').length;
  const totalCount = verdicts.length || 1;
  const coveragePct = Math.round((demonstratedCount / totalCount) * 100);

  const proofDepthData = [
    { name: 'Implementation', count: evidences.filter((e) => e.evidence_strength === 'implementation').length, color: '#4ADE80' },
    { name: 'Application', count: evidences.filter((e) => e.evidence_strength === 'application').length, color: '#7C9CF5' },
    { name: 'Tests', count: evidences.filter((e) => e.evidence_strength === 'test').length, color: '#5DDCB4' },
    { name: 'Docs', count: evidences.filter((e) => e.evidence_strength === 'documentation').length, color: '#A1A1AA' },
  ];

  const headSha = Object.values(assessment.current_sha_by_repo)[0] || 'e4b9c10a28';

  return (
    <div className="space-y-8 pb-20">

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="panel p-7 relative overflow-hidden"
      >
        {/* Subtle gold gradient */}
        <div className="absolute top-0 right-0 w-[360px] h-[220px] bg-gradient-to-bl from-[#E8C547]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-32 bg-gradient-to-tr from-[#7C9CF5]/4 to-transparent blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left content */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-eyebrow">Target Role</span>
              <span className="h-3 w-[1px] bg-white/10" />
              <span className="text-[11px] font-mono text-[#52525B]">via {job.employer}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80] animate-pulse-dot ml-1" />
              <span className="text-[11px] text-[#4ADE80] font-mono">Live</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white leading-tight max-w-xl">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#52525B]">
              <a
                href={job.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#7C9CF5] hover:text-[#A3B9FF] transition-colors font-mono"
              >
                Original Posting
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <span>•</span>
              <span className="font-mono">
                Retrieved {new Date(job.fetched_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="font-mono">
                Assessment <span className="text-white">v{assessment.version}.0</span>
              </span>
            </div>

            {/* Scope */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#52525B] pt-1">
              <GitBranch className="h-3.5 w-3.5 text-[#7C9CF5]" />
              <span>Reviewed:</span>
              <span className="text-[#A1A1AA]">{assessment.reviewed_scope?.repos?.join(', ')} (branch: main)</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end shrink-0">
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={isSimulating}
              onClick={() => onSimulatePush('add_sql')}
              className="btn-primary"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Processing Reassessment…
                </>
              ) : (
                <>
                  <GitCommit className="h-3.5 w-3.5" />
                  Simulate SQL Commit
                </>
              )}
            </motion.button>
            <button
              disabled={isSimulating}
              onClick={() => onSimulatePush('delete_sql')}
              className="btn-secondary text-[12px] py-2"
            >
              <Minus className="h-3.5 w-3.5" />
              Delete SQL (Downgrade)
            </button>
          </div>
        </div>

        {/* Disclaimer strip */}
        <div className="mt-5 pt-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-[#52525B] italic">
            ✦ Absence of code evidence in this repository does <strong className="text-[#A1A1AA] font-medium not-italic">NOT</strong> mean the student lacks ability — only that it was not observed in the reviewed scope.
          </p>
        </div>
      </motion.div>

      {/* ── Metric Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          i={0}
          label="Verified Skills"
          value={demonstratedCount}
          sub={`of ${totalCount} requirements`}
        />
        <MetricCard
          i={1}
          label="Portfolio Match"
          value={`${coveragePct}%`}
          sub={assessment.coverage?.formula || 'code-grounded metric'}
          accent
        />
        <MetricCard
          i={2}
          label="Head SHA"
          value={headSha.slice(0, 9)}
          sub={
            <a
              href={`https://github.com/Yadnesh2007/SAHAYOG/commit/${headSha}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#7C9CF5] hover:text-[#A3B9FF] transition-colors"
            >
              View on GitHub <ExternalLink className="h-2.5 w-2.5" />
            </a>
          }
        />
        <MetricCard
          i={3}
          label="Freshness"
          value={
            <span className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${assessment.freshness === 'current' ? 'bg-[#4ADE80] animate-pulse-dot' : 'bg-[#F59E0B]'}`} />
              <span className="capitalize">{assessment.freshness}</span>
            </span>
          }
          sub="Auto-reassessed via GitHub"
        />
      </div>

      {/* ── Main 2-col layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Verdict Matrix */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="section-eyebrow mb-1">Evidence Matrix</p>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Requirement-by-Requirement Verdicts
              </h2>
            </div>
            <span className="panel-inner px-3 py-1.5 text-[11px] font-mono text-[#52525B]">
              {verdicts.length} requirements
            </span>
          </div>

          <div className="space-y-2">
            {verdicts.map((verdict, i) => {
              const matchingEv = evidences.filter((e) => (verdict.evidence_ids || []).includes(e.id));
              const isOpen = expandedId === verdict.requirement_id;

              return (
                <motion.div
                  key={verdict.requirement_id}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className={`verdict-row ${isOpen ? 'open' : ''}`}
                >
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : verdict.requirement_id)}
                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[11px] font-mono font-semibold text-[#A1A1AA] uppercase tracking-widest">
                          {verdict.skill_key.replace(/_/g, ' ')}
                        </span>
                        <StatusBadge status={verdict.status} />
                      </div>
                      <p className="text-sm font-medium text-white leading-snug">{verdict.exact_claim}</p>
                      <p className="text-[12px] text-[#52525B] leading-relaxed truncate-2">{verdict.rationale}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="panel-inner px-2.5 py-1 text-[11px] font-mono text-[#52525B]">
                        {matchingEv.length} citation{matchingEv.length !== 1 ? 's' : ''}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-[#52525B] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Expanded drawer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06] pt-4">

                          {/* Limitations */}
                          {verdict.limitations?.length > 0 && (
                            <div className="panel-inner p-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <ShieldAlert className="h-3.5 w-3.5 text-[#FCD34D]" />
                                <span className="text-[11px] font-semibold text-[#FCD34D] uppercase tracking-wider">
                                  Audit Disclosures
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {verdict.limitations.map((lim, j) => (
                                  <li key={j} className="text-[11px] text-[#A1A1AA] pl-5">
                                    <span className="text-[#52525B] mr-1.5">•</span>{lim}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Citations */}
                          {matchingEv.length > 0 ? (
                            <div className="space-y-3">
                              <p className="section-eyebrow">Source Code Citations</p>
                              {matchingEv.map((ev) => (
                                <EvidenceCard
                                  key={ev.id}
                                  evidence={ev}
                                  onOpenDefense={onOpenCodeDefense}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="panel-inner p-4 border border-[#F87171]/10 space-y-1.5">
                              <p className="text-[12px] font-semibold text-[#F87171]">No implementation evidence detected in current scope.</p>
                              <p className="text-[11px] text-[#52525B]">
                                Push a commit to GitHub to trigger automatic reassessment, or use the <strong className="text-[#E8C547] font-medium">Simulate SQL Push</strong> button.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Charts & Info */}
        <div className="space-y-4">
          {/* Coverage visual */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="panel p-5 space-y-4"
          >
            <div>
              <p className="section-eyebrow mb-1">Proof Depth</p>
              <h3 className="text-sm font-semibold text-white">Evidence by Strength</h3>
            </div>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proofDepthData} layout="vertical" margin={{ left: -10, right: 8, top: 0, bottom: 0 }}>
                  <XAxis type="number" stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#52525B" fontSize={10} width={90} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{
                      background: '#18181B',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F4F4F5',
                    }}
                    itemStyle={{ color: '#E8C547' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {proofDepthData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="progress-track">
              <div className="progress-fill progress-fill-green" style={{ width: `${coveragePct}%` }} />
            </div>
            <p className="text-[11px] text-[#52525B] leading-relaxed">
              Engineering proof requires balanced depth: implementation logic, integration application, and unit test assertions.
            </p>
          </motion.div>

          {/* The Grounded Difference */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="panel p-5 space-y-4"
          >
            <div>
              <p className="section-eyebrow mb-1">Methodology</p>
              <h3 className="text-sm font-semibold text-white">The Grounded Difference</h3>
            </div>

            <ul className="space-y-3">
              {[
                {
                  title: 'Zero hallucinated claims',
                  desc: 'Every positive verdict cites an immutable commit SHA and line range.',
                },
                {
                  title: 'Auto-updating',
                  desc: 'A single GitHub push triggers automated reassessment — no manual clicks.',
                },
                {
                  title: 'Honest scope boundaries',
                  desc: 'Absence is bounded to the reviewed repo. Never declaring incompetence.',
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#4ADE80]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-[#4ADE80]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white">{item.title}</p>
                    <p className="text-[11px] text-[#52525B] leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const EvidenceCard: React.FC<{ evidence: Evidence; onOpenDefense: (id: string) => void }> = ({
  evidence: ev,
  onOpenDefense,
}) => (
  <div className="panel-inner p-4 space-y-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 font-mono min-w-0">
        <FileCode2 className="h-3.5 w-3.5 text-[#7C9CF5] shrink-0" />
        <span className="text-[12px] text-white font-medium truncate">{ev.file_path}</span>
        <span className="text-[11px] text-[#E8C547] shrink-0">
          L{ev.start_line}–{ev.end_line}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="panel-deep px-2 py-0.5 text-[10px] font-mono text-[#7C9CF5] uppercase">
          {ev.evidence_strength}
        </span>
        <a
          href={ev.permalink}
          target="_blank"
          rel="noreferrer"
          className="text-[#52525B] hover:text-[#A1A1AA] transition-colors"
          title="View on GitHub"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>

    <p className="text-[12px] text-[#A1A1AA] leading-relaxed">{ev.observed_behavior}</p>

    {ev.snippet && (
      <div className="code-block text-[11px]">
        <pre className="whitespace-pre-wrap">{ev.snippet}</pre>
      </div>
    )}

    <div className="flex items-center justify-between pt-1">
      <span className="text-[10px] text-[#52525B] font-mono">Rule: {ev.analyzer_rule_id}</span>
      <button
        onClick={() => onOpenDefense(ev.id)}
        className="btn-ghost text-[11px] text-[#E8C547]/70 hover:text-[#E8C547] gap-1.5"
      >
        <Terminal className="h-3 w-3" />
        Defend in Code Defense
      </button>
    </div>
  </div>
);
