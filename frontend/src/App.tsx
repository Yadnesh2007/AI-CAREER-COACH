import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ImpactMap } from './components/ImpactMap';
import { EvidencePassport } from './components/EvidencePassport';
import { GapLab } from './components/GapLab';
import { CodeDefense } from './components/CodeDefense';
import { SkillMap } from './components/SkillMap';
import { DemoProofDossier } from './components/DemoProofDossier';
import { Assessment, Job } from './lib/types';
import { 
  checkBackendHealth, 
  fetchAssessment, 
  fetchJobs, 
  simulatePush 
} from './lib/api';
import { Sparkles, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

const pageTransition: any = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync data from backend
  const syncData = async () => {
    try {
      await checkBackendHealth();
      setIsBackendConnected(true);

      const [jobsData, asmtData] = await Promise.all([
        fetchJobs(),
        fetchAssessment('asmt_init_stripe_01')
      ]);

      if (jobsData.length > 0) setJob(jobsData[0]);
      
      // If version increased, show toast
      if (assessment && asmtData.version > assessment.version) {
        setToastMessage(`⚡ Version ${asmtData.version}.0: Reassessment automatically promoted SQL query writing!`);
        setTimeout(() => setToastMessage(null), 6000);
      }
      
      setAssessment(asmtData);
    } catch (err) {
      console.warn('Backend sync check failed', err);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 3000);
    return () => clearInterval(interval);
  }, [assessment?.version]);

  const handleSimulatePush = async (action: 'add_sql' | 'delete_sql') => {
    if (!assessment) return;
    setIsSimulating(true);
    try {
      const repoId = assessment.repository_ids[0] || 'repo_sahayog_01';
      await simulatePush(repoId, action);
      await syncData();
      if (action === 'add_sql') {
        setActiveTab('impact'); // Jump to impact map to show the live transition!
      }
    } catch (err) {
      console.error('Simulate push error', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleOpenCodeDefense = (evidenceId: string) => {
    setSelectedEvidenceId(evidenceId);
    setActiveTab('defense');
  };

  return (
    <div className="min-h-screen bg-app text-[#F4F4F5] relative selection:bg-[#E8C547]/20 selection:text-[#F4F4F5]">
      {/* Background radial ambient lights (60% background subtlety) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#E8C547]/[0.035] via-transparent to-transparent blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-l from-[#7C9CF5]/[0.02] to-transparent blur-[140px]" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl panel border-[#E8C547]/30 shadow-2xl flex items-center gap-3 text-xs text-white"
            style={{
              background: '#111113',
              boxShadow: '0 0 0 1px rgba(232,197,71,0.2), 0 20px 40px -10px rgba(0,0,0,0.8)'
            }}
          >
            <div className="h-7 w-7 rounded-lg bg-[#E8C547]/10 border border-[#E8C547]/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-[#E8C547]" />
            </div>
            <span className="font-medium text-[#F4F4F5]">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendConnected={isBackendConnected}
        onSimulatePush={handleSimulatePush}
        isSimulating={isSimulating}
        version={assessment?.version || 1}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" {...pageTransition}>
              <Dashboard
                assessment={assessment}
                job={job}
                onSimulatePush={handleSimulatePush}
                isSimulating={isSimulating}
                onOpenCodeDefense={handleOpenCodeDefense}
              />
            </motion.div>
          )}

          {activeTab === 'impact' && (
            <motion.div key="impact" {...pageTransition}>
              <ImpactMap
                assessmentId={assessment?.id || 'asmt_init_stripe_01'}
                onSimulatePush={handleSimulatePush}
                isSimulating={isSimulating}
              />
            </motion.div>
          )}

          {activeTab === 'passport' && (
            <motion.div key="passport" {...pageTransition}>
              <EvidencePassport
                assessmentId={assessment?.id || 'asmt_init_stripe_01'}
              />
            </motion.div>
          )}

          {activeTab === 'gaplab' && (
            <motion.div key="gaplab" {...pageTransition}>
              <GapLab
                assessmentId={assessment?.id || 'asmt_init_stripe_01'}
                onSimulatePush={handleSimulatePush}
                isSimulating={isSimulating}
              />
            </motion.div>
          )}

          {activeTab === 'defense' && (
            <motion.div key="defense" {...pageTransition}>
              <CodeDefense
                assessmentId={assessment?.id || 'asmt_init_stripe_01'}
                initialEvidenceId={selectedEvidenceId}
              />
            </motion.div>
          )}

          {activeTab === 'skillmap' && (
            <motion.div key="skillmap" {...pageTransition}>
              <SkillMap
                assessmentId={assessment?.id || 'asmt_init_stripe_01'}
              />
            </motion.div>
          )}

          {activeTab === 'dossier' && (
            <motion.div key="dossier" {...pageTransition}>
              <DemoProofDossier
                assessment={assessment!}
                job={job!}
                onSimulatePush={handleSimulatePush}
                isSimulating={isSimulating}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle editorial footer */}
      <footer className="border-t border-white/[0.06] mt-20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#52525B] font-mono">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8C547]" />
            <span className="text-[#A1A1AA] font-sans font-semibold tracking-tight">CareerProof</span>
            <span>· Grounded Engineering Assessment</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Deterministic AST Verification</span>
            <span>HMAC-SHA256 Webhooks</span>
            <span>Zero Hallucination</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
