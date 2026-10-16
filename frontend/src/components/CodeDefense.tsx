import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Send,
  CheckCircle2,
  Lightbulb,
  FileCode2,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';
import { startCodeDefense, submitCodeDefenseAnswer } from '../lib/api';

interface CodeDefenseProps {
  assessmentId: string;
  initialEvidenceId?: string;
}

export const CodeDefense: React.FC<CodeDefenseProps> = ({
  assessmentId,
  initialEvidenceId,
}) => {
  const [session, setSession] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLoading(true);
    setFeedbackData(null);
    setAnswer('');
    startCodeDefense(assessmentId, initialEvidenceId)
      .then(setSession)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [assessmentId, initialEvidenceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !session?.session_id) return;
    setSubmitting(true);
    try {
      const res = await submitCodeDefenseAnswer(session.session_id, answer);
      setFeedbackData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFeedbackData(null);
    setAnswer('');
    textareaRef.current?.focus();
  };

  if (loading || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border border-[#E8C547]/10" />
          <div className="absolute inset-0 rounded-full border-t border-[#E8C547]/60 animate-spin" />
        </div>
        <p className="text-sm text-[#A1A1AA]">Preparing Code Defense session…</p>
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
        <div className="absolute top-0 right-0 w-64 h-48 bg-gradient-to-bl from-[#93C5FD]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <p className="section-eyebrow">Innovation #4 · Verbal Technical Defense</p>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-white">
            Code Defense Mode
          </h1>
          <p className="text-sm text-[#A1A1AA] max-w-xl leading-relaxed">
            Don't just rely on written code. In high-bar technical interviews, senior engineers probe
            why you chose specific designs, concurrency approaches, and edge case defenses.
          </p>
        </div>
      </motion.div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Context & Question */}
        <div className="space-y-4">

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="panel p-6 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#E8C547]" />
              <span className="section-eyebrow">Interview Defense Prompt</span>
            </div>
            <p className="text-[14px] font-medium text-white leading-relaxed">
              {session.question}
            </p>
          </motion.div>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="panel p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-[#7C9CF5]" />
                <span className="text-[13px] font-mono font-medium text-white">
                  {session.evidence_file}
                </span>
              </div>
              <span className="section-eyebrow">Observed Artifact</span>
            </div>

            <div className="code-block">
              <pre className="whitespace-pre-wrap">{session.code_snippet}</pre>
            </div>

            <p className="text-[11px] text-[#52525B] font-mono">
              Behavior: {session.observed_behavior}
            </p>
          </motion.div>
        </div>

        {/* Right: Answer & Feedback */}
        <div className="space-y-4">

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="panel p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#5DDCB4]" />
              <span className="section-eyebrow">Your Architectural Defense</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                ref={textareaRef}
                rows={7}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Explain your design decisions, error handling strategy (HTTP 400 vs 500), input validation guarantees, and how you would scale this service…"
                disabled={!!feedbackData}
                className="w-full bg-[#111113] border border-white/[0.06] rounded-lg p-4 text-[13px] text-white placeholder-[#52525B] focus:outline-none focus:border-[#E8C547]/30 leading-relaxed resize-none transition-colors disabled:opacity-60"
              />
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting || !answer.trim() || !!feedbackData}
                className="btn-primary w-full justify-center"
              >
                {submitting ? (
                  <>
                    <div className="h-3.5 w-3.5 rounded-full border-t border-[#0A0A0B] animate-spin" />
                    Evaluating Defense…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit for AI Evaluation
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Feedback panel */}
          <AnimatePresence>
            {feedbackData && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="panel p-6 space-y-4 border-[#4ADE80]/15"
                style={{ boxShadow: '0 0 0 1px rgba(74,222,128,0.08), 0 0 24px rgba(74,222,128,0.04)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#4ADE80]" />
                    <span className="text-[13px] font-semibold text-white">
                      Architectural Evaluation
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="btn-ghost text-[11px] gap-1.5"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Try Again
                  </button>
                </div>

                <div className="panel-inner p-4">
                  <p className="text-[13px] text-[#A1A1AA] leading-relaxed">{feedbackData.feedback}</p>
                </div>

                {feedbackData.critique_points?.length > 0 && (
                  <div className="space-y-2">
                    <p className="section-eyebrow">Key Insights</p>
                    <ul className="space-y-2">
                      {feedbackData.critique_points.map((pt: string, i: number) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-2.5 text-[12px] text-[#A1A1AA]"
                        >
                          <Lightbulb className="h-3.5 w-3.5 text-[#FCD34D] shrink-0 mt-0.5" />
                          {pt}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
