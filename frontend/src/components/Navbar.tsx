import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCommit,
  Activity,
  Map,
  Award,
  Beaker,
  Terminal,
  Network,
  FileCheck2,
  LayoutDashboard,
  ChevronDown,
  RefreshCw,
  Menu,
  X,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendConnected: boolean;
  onSimulatePush: (action: 'add_sql' | 'delete_sql') => void;
  isSimulating: boolean;
  version: number;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'impact', label: 'Impact Map', icon: Map },
  { id: 'passport', label: 'Evidence', icon: Award },
  { id: 'gaplab', label: 'Gap Lab', icon: Beaker },
  { id: 'defense', label: 'Code Defense', icon: Terminal },
  { id: 'skillmap', label: 'Skill Graph', icon: Network },
  { id: 'dossier', label: 'Judge Dossier', icon: FileCheck2, accent: true },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  onSimulatePush,
  isSimulating,
  version,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Top border accent line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E8C547] to-transparent opacity-60" />

        <div className="bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between h-14">

              {/* ── Brand ── */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-3 group"
              >
                <div className="relative h-7 w-7 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-lg bg-[#E8C547]/10 group-hover:bg-[#E8C547]/15 transition-colors" />
                  <Zap className="h-3.5 w-3.5 text-[#E8C547] relative z-10" fill="currentColor" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-bold tracking-tight text-white">
                    CareerProof
                  </span>
                  <span className="text-[10px] font-mono text-[#E8C547]/70 hidden sm:block">
                    v{version}.0
                  </span>
                </div>
              </button>

              {/* ── Nav Tabs (desktop) ── */}
              <nav className="hidden lg:flex items-center">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`nav-tab ${isActive ? 'active' : ''} ${
                        item.accent ? 'text-[#E8C547]/60 hover:text-[#E8C547]' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* ── Right Controls ── */}
              <div className="flex items-center gap-3">
                {/* Live status indicator */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111113] border border-white/[0.06]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isBackendConnected
                        ? 'bg-[#4ADE80] animate-pulse-dot'
                        : 'bg-[#F87171]'
                    }`}
                  />
                  <span className="text-[11px] font-mono text-[#A1A1AA]">
                    {isBackendConnected ? 'API Connected' : 'Offline'}
                  </span>
                </div>

                {/* Push trigger */}
                <motion.button
                  disabled={isSimulating}
                  onClick={() => onSimulatePush('add_sql')}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-[12px] py-2 px-4 hidden sm:flex"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Processing…</span>
                    </>
                  ) : (
                    <>
                      <GitCommit className="h-3.5 w-3.5" />
                      <span>Simulate Push</span>
                    </>
                  )}
                </motion.button>

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden btn-ghost p-2"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-[#0A0A0B]/98 backdrop-blur-xl border-b border-white/[0.06] shadow-xl"
          >
            <div className="max-w-[1400px] mx-auto px-5 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#E8C547]/10 text-[#E8C547]'
                        : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
              <div className="mt-2 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                <button
                  disabled={isSimulating}
                  onClick={() => { onSimulatePush('add_sql'); setMobileOpen(false); }}
                  className="btn-primary w-full justify-center"
                >
                  <GitCommit className="h-4 w-4" />
                  {isSimulating ? 'Processing…' : 'Simulate SQL Push'}
                </button>
                <div className="flex items-center gap-2 justify-center">
                  <span className={`h-1.5 w-1.5 rounded-full ${isBackendConnected ? 'bg-[#4ADE80]' : 'bg-[#F87171]'}`} />
                  <span className="text-[11px] font-mono text-[#A1A1AA]">
                    {isBackendConnected ? 'API Connected · FastAPI 8000' : 'Backend Offline'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
