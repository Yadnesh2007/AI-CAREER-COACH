import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Download,
  Printer,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { fetchPassport } from '../lib/api';

interface EvidencePassportProps {
  assessmentId: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; cls: string }> = {
  demonstrated: {
    label: 'Demonstrated',
    icon: CheckCircle2,
    cls: 'status-demonstrated',
  },
  partially_demonstrated: {
    label: 'Partial',
    icon: AlertTriangle,
    cls: 'status-partial',
  },
  not_demonstrated_in_reviewed_scope: {
    label: 'Not in Scope',
    icon: XCircle,
    cls: 'status-not-demonstrated',
  },
  unable_to_assess: {
    label: 'Unable',
    icon: HelpCircle,
    cls: 'status-unable',
  },
};

const MetaField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-mono text-[#52525B] uppercase tracking-wider">{label}</p>
    <p className="text-[13px] font-medium text-white">{value}</p>
  </div>
);

export const EvidencePassport: React.FC<EvidencePassportProps> = ({ assessmentId }) => {
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    fetchPassport(assessmentId)
      .then(setPassport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [assessmentId]);

  const exportJSON = () => {
    if (!passport) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(passport, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `CareerProof-Passport-${passport.passport_id}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading || !passport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border border-[#E8C547]/10" />
          <div className="absolute inset-0 rounded-full border-t border-[#E8C547]/60 animate-spin" />
        </div>
        <p className="text-sm text-[#A1A1AA]">Generating Skill Evidence Passport…</p>
      </div>
    );
  }

  const filteredVerdicts = (passport.verdicts || []).filter(
    (v: any) =>
      v.skill_key.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (v.exact_claim || '').toLowerCase().includes(filterQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="panel p-7 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-48 bg-gradient-to-bl from-[#4ADE80]/4 to-transparent blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="section-eyebrow">Verified Skill Passport</p>
              <span className="text-[11px] font-mono text-[#52525B]">ID: {passport.passport_id}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-white">
              Skill Evidence Passport
            </h1>
            <p className="text-sm text-[#A1A1AA] max-w-xl leading-relaxed">
              Auditable, tamper-resistant proof of engineering competency grounded in verified GitHub source code and authentic employer role requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button onClick={exportJSON} className="btn-secondary text-[12px]">
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </button>
            <button onClick={() => window.print()} className="btn-primary text-[12px]">
              <Printer className="h-3.5 w-3.5" />
              Print / PDF
            </button>
          </div>
        </div>

        {/* Meta strip */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetaField label="Candidate" value="Yadnesh (SWE)" />
          <MetaField label="Target Employer" value={
            <span className="text-[#7C9CF5]">{passport.employer}</span>
          } />
          <MetaField label="Evaluated" value={new Date(passport.evaluated_at).toLocaleString()} />
          <MetaField label="Snapshot Version" value={
            <span className="text-[#4ADE80]">v{passport.version}.0 (Current)</span>
          } />
        </div>
      </motion.div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills or claims…"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-[#111113] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-white placeholder-[#52525B] focus:outline-none focus:border-[#E8C547]/30 transition-colors"
          />
        </div>
        <span className="text-[11px] font-mono text-[#52525B]">
          {filteredVerdicts.length} / {passport.verdicts?.length || 0} skills
        </span>
      </div>

      {/* Skill Cards */}
      <div className="space-y-3">
        {filteredVerdicts.map((v: any, index: number) => {
          const cfg = STATUS_CONFIG[v.status] || STATUS_CONFIG.unable_to_assess;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="panel p-6 space-y-4"
            >
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-mono font-bold text-white uppercase tracking-widest">
                    {v.skill_key.replace(/_/g, ' ')}
                  </span>
                  <span className={`status-pill ${cfg.cls}`}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#52525B]">
                  Confidence: <span className="text-[#A1A1AA] capitalize">{v.confidence}</span>
                </span>
              </div>

              {/* Claim & rationale */}
              <div className="space-y-1.5">
                <p className="text-[13px] font-semibold text-white leading-snug">{v.exact_claim}</p>
                <p className="text-[12px] text-[#A1A1AA] leading-relaxed">{v.rationale}</p>
              </div>

              {/* Citations grid */}
              {v.citations?.length > 0 ? (
                <div className="space-y-2">
                  <p className="section-eyebrow">Source Code Citations</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {v.citations.map((c: any, i: number) => (
                      <div key={i} className="panel-inner p-3.5 space-y-2">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-[12px] text-white font-medium truncate max-w-[180px]">
                            {c.file}
                          </span>
                          <a
                            href={c.permalink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#E8C547] hover:text-[#F0CE57] transition-colors"
                          >
                            {c.lines}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-[11px] text-[#52525B] leading-relaxed">{c.behavior}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#52525B]">
                          <span>Repo: {c.repo}</span>
                          <span className="panel-deep px-2 py-0.5 text-[#7C9CF5]">{c.strength}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="panel-inner p-3.5 border-[#F87171]/10">
                  <p className="text-[12px] text-[#F87171]">No code citations found in reviewed scope.</p>
                </div>
              )}

              {/* Limitations */}
              {v.limitations?.length > 0 && (
                <div className="panel-inner p-3.5 space-y-1.5">
                  <p className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Limitations & Caveats</p>
                  <ul className="space-y-1">
                    {v.limitations.map((lim: string, idx: number) => (
                      <li key={idx} className="text-[11px] text-[#52525B]">
                        <span className="text-[#52525B] mr-1.5">•</span>{lim}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
