import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Square,
  FileCode2,
  Zap,
  BookOpen,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { GapTask } from '../lib/types';
import { fetchGapTasks } from '../lib/api';

interface GapLabProps {
  assessmentId: string;
  onSimulatePush: (action: 'add_sql' | 'delete_sql') => void;
  isSimulating: boolean;
}

export const GapLab: React.FC<GapLabProps> = ({
  assessmentId,
  onSimulatePush,
  isSimulating,
}) => {
  const [tasks, setTasks] = useState<GapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchGapTasks(assessmentId)
      .then((res) => setTasks(res.tasks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [assessmentId]);

  const toggleCheck = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-4">
        <div className="h-8 w-8 rounded-full border-t border-[#E8C547]/60 animate-spin" />
        <p className="text-sm text-[#A1A1AA]">Loading gap tasks…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="panel p-7 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-48 bg-gradient-to-bl from-[#FCD34D]/4 to-transparent blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <p className="section-eyebrow">Innovation #3 · Targeted Portfolio Engineering</p>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-white">
            AI Project Generator & Gap Lab
          </h1>
          <p className="text-sm text-[#A1A1AA] max-w-2xl leading-relaxed">
            Don't build generic to-do apps. CareerProof inspects your specific unproven role requirements
            and designs concrete, repository-grounded engineering tasks with verifiable code artifacts.
          </p>
        </div>
      </motion.div>

      {/* Task Cards */}
      <div className="space-y-5">
        {tasks.length === 0 && !loading && (
          <div className="panel p-8 text-center space-y-2">
            <p className="text-sm font-medium text-white">No gap tasks generated yet.</p>
            <p className="text-[12px] text-[#52525B]">Complete an assessment to generate targeted improvement tasks.</p>
          </div>
        )}

        {tasks.map((task, taskIdx) => {
          const totalSteps = task.steps.length;
          const completedCount = task.steps.filter(
            (_, idx) => !!completedSteps[`${task.id}-step-${idx}`],
          ).length;
          const pct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: taskIdx * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="panel p-6 sm:p-7 space-y-6"
            >
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.06]">
                <div className="space-y-1.5">
                  <p className="section-eyebrow">Targeted Gap · SQL Query Writing & Relational Architecture</p>
                  <h2 className="text-xl font-bold text-white tracking-tight">{task.title}</h2>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={isSimulating}
                  onClick={() => onSimulatePush('add_sql')}
                  className="btn-primary shrink-0"
                >
                  <Zap className="h-3.5 w-3.5" fill="currentColor" />
                  {isSimulating ? 'Processing…' : 'Complete & Prove via Push'}
                </motion.button>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#52525B] uppercase tracking-wider">Progress</span>
                  <span className="text-[11px] font-mono text-[#A1A1AA]">{completedCount}/{totalSteps} steps</span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              {/* Why this matters */}
              <div className="panel-inner p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-[#7C9CF5]" />
                  <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                    Why This Matters
                  </span>
                </div>
                <p className="text-[12px] text-[#52525B] leading-relaxed pl-5">
                  {task.why_this_matters}
                </p>
              </div>

              {/* Files & Evidence grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="panel-inner p-4 space-y-2.5">
                  <p className="section-eyebrow">Suggested Files</p>
                  <div className="space-y-1.5 font-mono">
                    {task.suggested_files.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] text-[#E8C547]/80">
                        <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel-inner p-4 space-y-2.5">
                  <p className="section-eyebrow">Expected Evidence</p>
                  <ul className="space-y-1.5">
                    {task.expected_evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#A1A1AA]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#4ADE80] shrink-0 mt-0.5" />
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step checklist */}
              <div className="space-y-3">
                <p className="section-eyebrow">Implementation Checklist</p>
                <div className="space-y-2">
                  {task.steps.map((step, idx) => {
                    const key = `${task.id}-step-${idx}`;
                    const isChecked = !!completedSteps[key];
                    return (
                      <motion.div
                        key={key}
                        onClick={() => toggleCheck(key)}
                        whileTap={{ scale: 0.99 }}
                        className={`panel-inner p-3.5 cursor-pointer flex items-center gap-3 transition-all ${
                          isChecked ? 'border-[#4ADE80]/10 bg-[#4ADE80]/4' : 'hover:border-white/10'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {isChecked ? (
                            <motion.div
                              key="checked"
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.6, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <CheckSquare className="h-4 w-4 text-[#4ADE80] shrink-0" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="unchecked"
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.6, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Square className="h-4 w-4 text-[#52525B] shrink-0" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <span
                          className={`text-[13px] transition-colors ${
                            isChecked ? 'line-through text-[#52525B]' : 'text-[#A1A1AA]'
                          }`}
                        >
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Validation checklist */}
              {task.validation_checklist?.length > 0 && (
                <div className="panel-inner p-4 space-y-2">
                  <p className="section-eyebrow">Validation Checklist</p>
                  <ul className="space-y-1.5">
                    {task.validation_checklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#52525B]">
                        <ArrowRight className="h-3.5 w-3.5 text-[#E8C547] shrink-0 mt-0.5" />
                        {item}
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
