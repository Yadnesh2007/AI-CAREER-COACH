import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCommit,
  ArrowRight,
  CheckCircle2,
  Activity,
  Zap,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { ChangeEvent, AssessmentHistoryEntry } from '../lib/types';
import { fetchEvents, fetchAssessmentHistory, fetchImpactMap } from '../lib/api';

interface ImpactMapProps {
  assessmentId: string;
  onSimulatePush: (action: 'add_sql' | 'delete_sql') => void;
  isSimulating: boolean;
}

const PIPELINE_STAGES = [
  {
    id: '01',
    title: 'HMAC Ingress',
    desc: 'Validates X-Hub-Signature-256 over raw payload bytes. Deduplicates delivery ID.',
    latency: '~120ms',
    status: 'done',
  },
  {
    id: '02',
    title: 'Queue & Worker',
    desc: 'PostgreSQL transactional leasing. Isolates push ref to prevent stale HEAD race conditions.',
    latency: '~240ms',
    status: 'done',
  },
  {
    id: '03',
    title: 'AST & Lexer Engine',
    desc: 'Parses SQL DML via sqlglot & Python AST. Confirms parameterization and exact lines.',
    latency: '~850ms',
    status: 'done',
  },
  {
    id: '04',
    title: 'Auto-Promotion',
    desc: 'Creates immutable new Assessment version and updates citations without manual user clicks.',
    latency: 'Total < 1.5s',
    status: 'active',
  },
];

const statusColors: Record<string, string> = {
  demonstrated: '#4ADE80',
  partially_demonstrated: '#FCD34D',
  not_demonstrated_in_reviewed_scope: '#F87171',
  unable_to_assess: '#93C5FD',
};

export const ImpactMap: React.FC<ImpactMapProps> = ({
  assessmentId,
  onSimulatePush,
  isSimulating,
}) => {
  const [events, setEvents] = useState<ChangeEvent[]>([]);
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [evRes, histRes] = await Promise.all([
        fetchEvents(assessmentId),
        fetchAssessmentHistory(assessmentId),
      ]);
      setEvents(evRes.events || []);
      setHistory(histRes.versions || []);
    } catch (err) {
      console.error('ImpactMap load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [assessmentId]);

  const historiesWithChanges = history.filter((h) => (h.verdict_changes || []).length > 0);

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="panel p-7 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-48 bg-gradient-to-bl from-[#7C9CF5]/6 to-transparent blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="space-y-2">
            <p className="section-eyebrow">Innovation #1</p>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-white">
              Commit-to-Career Impact Map
            </h1>
            <p className="text-sm text-[#A1A1AA] max-w-xl leading-relaxed">
              Track how every verified GitHub push flows through the HMAC webhook ingress,
              durable worker queue, and AST engine to trigger automatic skill verdict promotions.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isSimulating}
            onClick={() => onSimulatePush('add_sql')}
            className="btn-primary shrink-0"
          >
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            {isSimulating ? 'Processing…' : 'Simulate SQL Push'}
          </motion.button>
        </div>
      </motion.div>

      {/* Pipeline Visual */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="panel p-6 space-y-5"
      >
        <div>
          <p className="section-eyebrow mb-1">Processing Pipeline</p>
          <h2 className="text-base font-semibold text-white">Real-time Ingestion & Verification</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {PIPELINE_STAGES.map((stage, i) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
              className={`panel-inner p-4 space-y-2.5 relative ${
                stage.status === 'active' ? 'border-[#E8C547]/20' : 'border-[#4ADE80]/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold uppercase ${
                  stage.status === 'active' ? 'text-[#E8C547]' : 'text-[#4ADE80]'
                }`}>
                  Stage {stage.id}
                </span>
                {stage.status === 'active' ? (
                  <Activity className="h-3.5 w-3.5 text-[#E8C547] animate-pulse" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#4ADE80]" />
                )}
              </div>
              <h3 className="text-[13px] font-semibold text-white">{stage.title}</h3>
              <p className="text-[11px] text-[#52525B] leading-relaxed">{stage.desc}</p>
              <p className={`text-[10px] font-mono ${
                stage.status === 'active' ? 'text-[#E8C547]' : 'text-[#52525B]'
              }`}>
                {stage.latency}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Flow arrows between stages on desktop */}
        <div className="hidden md:flex items-center justify-center gap-1 text-[#52525B]">
          {[0,1,2].map((i) => (
            <ArrowRight key={i} className="h-3.5 w-3.5" />
          ))}
        </div>
      </motion.div>

      {/* Verdict Transitions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow mb-1">Audit Trail</p>
            <h2 className="text-lg font-semibold text-white">Verdict Transitions & Diffs</h2>
          </div>
          <span className="panel-inner px-3 py-1.5 text-[11px] font-mono text-[#52525B]">
            {historiesWithChanges.length} transitions
          </span>
        </div>

        {historiesWithChanges.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {historiesWithChanges.map((h, hi) => (
                <motion.div
                  key={h.version}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hi * 0.05, duration: 0.3 }}
                  className="panel p-5 space-y-4"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B] pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-[#E8C547]/10 text-[#E8C547] font-bold border border-[#E8C547]/20">
                        v{h.version}.0
                      </span>
                      <span>Trigger: {h.trigger_event_id || 'Initial Scan'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {new Date(h.evaluated_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {h.verdict_changes.map((vc, i) => (
                      <div key={i} className="panel-inner p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <span className="text-[11px] font-mono font-semibold text-white uppercase tracking-wider">
                            {vc.skill_key.replace(/_/g, ' ')}
                          </span>
                          <p className="text-[12px] text-[#A1A1AA]">{vc.reason}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="px-3 py-1 rounded text-[11px] font-mono border border-[#F87171]/20 text-[#F87171] bg-[#F87171]/8">
                            {vc.before?.replace(/_/g, ' ')}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#52525B]" />
                          <span className="px-3 py-1 rounded text-[11px] font-mono font-semibold border border-[#4ADE80]/20 text-[#4ADE80] bg-[#4ADE80]/8">
                            {vc.after?.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="panel p-8 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-[#E8C547]/10 flex items-center justify-center mx-auto">
              <Activity className="h-5 w-5 text-[#E8C547]" />
            </div>
            <p className="text-sm font-medium text-white">No verdict transitions yet</p>
            <p className="text-[12px] text-[#52525B] max-w-xs mx-auto">
              Click <strong className="text-[#E8C547] font-medium">Simulate SQL Push</strong> to push a verified SQL file and observe the live transition from <em>Not Demonstrated</em> to <em>Demonstrated</em>.
            </p>
          </div>
        )}
      </div>

      {/* Events Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow mb-1">Webhook Log</p>
            <h2 className="text-lg font-semibold text-white">GitHub Change Events</h2>
          </div>
          <span className="panel-inner px-3 py-1.5 text-[11px] font-mono text-[#52525B]">
            {events.length} events
          </span>
        </div>

        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="panel-inner p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-[11px]"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-3.5 w-3.5 text-[#7C9CF5]" />
                    <span className="text-white font-semibold text-[12px]">
                      {ev.message || 'Push event processed'}
                    </span>
                    <span className="panel-deep px-2 py-0.5 text-[#A1A1AA]">
                      {ev.after_sha.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[#52525B]">
                    <span>Delivery: {ev.delivery_id || 'local-push'}</span>
                    <span>Ref: {ev.ref}</span>
                    <span className="text-[#4ADE80]">
                      v{ev.from_version || 1} → v{ev.to_version || 2}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ev.changed_files.map((cf, j) => (
                    <span key={j} className="panel-deep px-2 py-0.5 text-[#A1A1AA]">
                      {cf.change_type === 'added' ? '+' : '-'}{cf.path}
                    </span>
                  ))}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    ev.state === 'updated' ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20' :
                    ev.state === 'analyzing' ? 'bg-[#E8C547]/10 text-[#E8C547] border border-[#E8C547]/20' :
                    'bg-white/5 text-[#A1A1AA] border border-white/10'
                  }`}>
                    {ev.state}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="panel p-6 text-center text-[12px] text-[#52525B]">
            No incoming webhook events detected yet. Simulate a push to generate one.
          </div>
        )}
      </div>
    </div>
  );
};
