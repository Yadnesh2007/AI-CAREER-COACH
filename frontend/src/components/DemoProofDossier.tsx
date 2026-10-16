import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitCommit,
  Zap,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Play,
} from 'lucide-react';
import { Assessment, Job } from '../lib/types';

interface DemoProofDossierProps {
  assessment: Assessment;
  job: Job;
  onSimulatePush: (action: 'add_sql' | 'delete_sql') => void;
  isSimulating: boolean;
}

const DEMO_STEPS = [
  {
    time: '0:00 – 0:40',
    title: 'Authentic Job Posting & Extracted Requirements',
    desc: (job: Job) =>
      `Stripe Early Career Software Engineer listing (${job.source_url}) with 4 verbatim requirements.`,
    badge: 'Verified Source',
    badgeClass: 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20',
  },
  {
    time: '0:40 – 1:30',
    title: 'GitHub App Connection & Scoped Code Citations',
    desc: (job: Job, sha: string) =>
      `Inspects Yadnesh2007/SAHAYOG at commit ${sha.slice(0, 8)}. Verified Python and REST API handlers with exact line links.`,
    badge: 'Scoped Citations',
    badgeClass: 'bg-[#7C9CF5]/10 text-[#7C9CF5] border-[#7C9CF5]/20',
  },
  {
    time: '1:30 – 2:15',
    title: 'The Honest SQL Gap',
    desc: () =>
      `SQL query writing reported as "Not demonstrated in reviewed scope" with exact reviewed paths. No false claims of student inability.`,
    badge: 'Honest Gap',
    badgeClass: 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/20',
  },
  {
    time: '2:15 – 3:15',
    title: 'Real GitHub Push (database/queries.sql)',
    desc: () =>
      `Commit adds multi-table JOINs, conditional WHERE, and safe parameterization. HMAC webhook triggered.`,
    badge: 'Signed Webhook',
    badgeClass: 'bg-[#E8C547]/10 text-[#E8C547] border-[#E8C547]/20',
  },
  {
    time: '3:15 – 5:00',
    title: 'Instant Automatic Reassessment (v1 → v2)',
    desc: () =>
      `SQL query writing verdict promoted to Demonstrated. Immutable link to GitHub line citations. Audit log preserved.`,
    badge: 'Live Loop Proven',
    badgeClass: 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/25',
    highlight: true,
  },
];

const FAQS = [
  {
    q: 'How do you prevent LLM hallucinations?',
    a: 'The core verification is completely deterministic. Parsers (Python AST, sqlglot) extract syntax trees, file paths, line numbers, and blob SHAs. The LLM is used solely for natural-language explanations; it cannot invent file paths, commit SHAs, or positive verdicts.',
  },
  {
    q: 'What if a student copied code?',
    a: 'Code presence establishes demonstrated implementation evidence within reviewed scope, but CareerProof explicitly documents that static analysis does not certify human authorship. That is why we provide Code Defense Mode to test verbal architectural reasoning.',
  },
  {
    q: 'How do you authenticate GitHub webhooks?',
    a: 'The public webhook endpoint inspects the exact raw request bytes, computes an HMAC-SHA256 signature with the shared secret, and performs a constant-time comparison against X-Hub-Signature-256 before accepting any payload.',
  },
  {
    q: 'What happens if a student deletes evidence?',
    a: 'When a push deletes a previously verified file (e.g., database/queries.sql), the worker automatically invalidates prior observations, decrements the score, downgrades the verdict, and logs the change in the immutable assessment history.',
  },
];

export const DemoProofDossier: React.FC<DemoProofDossierProps> = ({
  assessment,
  job,
  onSimulatePush,
  isSimulating,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const primarySha = Object.values(assessment.current_sha_by_repo)[0] || 'e4b9c10a28f7';

  return (
    <div className="space-y-8 pb-20">

      {/* Header — Special gold border for judge dossier */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="panel p-7 relative overflow-hidden"
        style={{
          borderColor: 'rgba(232,197,71,0.2)',
          boxShadow: '0 0 0 1px rgba(232,197,71,0.06), 0 0 40px rgba(232,197,71,0.04)',
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-60 bg-gradient-to-bl from-[#E8C547]/8 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-[#E8C547]" />
              <p className="section-eyebrow">Judge Demonstration Suite · Hackathon W-PS-2</p>
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-white">
              5-Minute Live Demonstration Dossier
            </h1>
            <p className="text-sm text-[#A1A1AA] max-w-xl leading-relaxed">
              Inspect the end-to-end proof loop: authentic employer job posting, verified GitHub App
              repository scope, honest initial SQL gap, real commit push, and instant automated reassessment.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isSimulating}
            onClick={() => onSimulatePush('add_sql')}
            className="btn-primary shrink-0"
            style={{ boxShadow: '0 0 24px rgba(232,197,71,0.20)' }}
          >
            {isSimulating ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-t border-[#0A0A0B] animate-spin" />
                Executing…
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" fill="currentColor" />
                Execute Live Demo
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* 5-Minute Walkthrough */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="panel p-6 space-y-5"
      >
        <div>
          <p className="section-eyebrow mb-1">Demo Script</p>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#E8C547]" />
            Judges' 5-Minute Chronological Walkthrough
          </h2>
        </div>

        <div className="relative space-y-3 pl-4">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#E8C547]/20 via-[#E8C547]/10 to-transparent" />

          {DEMO_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
              className={`panel-inner p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative ${
                step.highlight ? 'border-[#4ADE80]/15' : ''
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#0A0A0B] border border-[#E8C547]/40 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#E8C547]/60" />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] text-[#E8C547] font-bold">{step.time}</span>
                  <span className="h-[1px] w-4 bg-[#52525B]" />
                  <span className="text-[13px] font-semibold text-white">{step.title}</span>
                </div>
                <p className="text-[12px] text-[#52525B] leading-relaxed">
                  {step.desc(job, primarySha)}
                </p>
              </div>

              <span
                className={`status-pill shrink-0 border ${step.badgeClass}`}
                style={{ fontFamily: 'Inter, sans-serif', textTransform: 'none', letterSpacing: 0 }}
              >
                {step.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Judge Q&A */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="panel p-6 space-y-4"
      >
        <div>
          <p className="section-eyebrow mb-1">Anticipated Q&A</p>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#7C9CF5]" />
            Judges' Technical Questions
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={`verdict-row ${isOpen ? 'open' : ''}`}>
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left"
                >
                  <span className="text-[13px] font-medium text-white">Q: {faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#52525B] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-white/[0.06] pt-3">
                        <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Key metrics summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Assessment Version', value: `v${assessment.version}.0` },
          { label: 'Active SHA', value: primarySha.slice(0, 9) },
          { label: 'Freshness', value: assessment.freshness || 'Current' },
          { label: 'Evidence Scope', value: assessment.reviewed_scope?.repos?.length ? `${assessment.reviewed_scope.repos.length} repo${assessment.reviewed_scope.repos.length > 1 ? 's' : ''}` : '1 repo' },
        ].map((item, i) => (
          <div key={i} className="metric-card">
            <p className="metric-label">{item.label}</p>
            <p className="text-lg font-bold text-white font-mono capitalize">{item.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
