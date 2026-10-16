import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { fetchSkillMap } from '../lib/api';

interface SkillMapProps {
  assessmentId: string;
}

const statusConfig = {
  demonstrated: {
    color: '#4ADE80',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.15)',
    label: 'Demonstrated',
    icon: CheckCircle2,
  },
  partially_demonstrated: {
    color: '#FCD34D',
    bg: 'rgba(252,211,77,0.08)',
    border: 'rgba(252,211,77,0.15)',
    label: 'Partial',
    icon: AlertTriangle,
  },
  not_demonstrated_in_reviewed_scope: {
    color: '#F87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.15)',
    label: 'Not in Scope',
    icon: XCircle,
  },
};

export const SkillMap: React.FC<SkillMapProps> = ({ assessmentId }) => {
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    fetchSkillMap(assessmentId)
      .then((data) => {
        setMapData(data);
        if (data?.nodes?.length > 0) setSelectedNode(data.nodes[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [assessmentId]);

  if (loading || !mapData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border border-[#E8C547]/10" />
          <div className="absolute inset-0 rounded-full border-t border-[#E8C547]/60 animate-spin" />
        </div>
        <p className="text-sm text-[#A1A1AA]">Rendering Skill Dependency Graph…</p>
      </div>
    );
  }

  const nodes: any[] = mapData.nodes || [];
  const edges: any[] = mapData.edges || [];

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="panel p-7 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-48 bg-gradient-to-bl from-[#7C9CF5]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <p className="section-eyebrow">Innovation #6 · Curated Prerequisite Architecture</p>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-white">
            Career Skill Dependency Map
          </h1>
          <p className="text-sm text-[#A1A1AA] max-w-xl leading-relaxed">
            Skills are not isolated keywords. Inspect hierarchical prerequisite relations and see how foundational
            language constructs scale into robust database and distributed systems proficiencies.
          </p>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Skill nodes grid */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <p className="section-eyebrow mb-1">Skill Topology</p>
            <h2 className="text-base font-semibold text-white">Interactive Dependency Graph</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nodes.map((node: any, i: number) => {
              const cfg = (statusConfig as any)[node.status] || statusConfig.not_demonstrated_in_reviewed_scope;
              const Icon = cfg.icon;
              const isSelected = selectedNode?.id === node.id;

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    borderColor: isSelected ? cfg.border : undefined,
                    background: isSelected ? cfg.bg : undefined,
                  }}
                  className={`panel p-5 cursor-pointer transition-all panel-interactive ${
                    isSelected ? 'shadow-panel-hover' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="panel-deep px-2 py-0.5 text-[10px] font-mono text-[#52525B] uppercase">
                      L{node.level} · {node.category}
                    </div>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: cfg.color }}
                    />
                  </div>

                  <h3 className="text-[14px] font-semibold text-white mb-2">{node.label}</h3>

                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                    <span className="text-[11px] font-medium capitalize" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Edges */}
          {edges.length > 0 && (
            <div className="panel-inner p-4 space-y-2.5">
              <p className="section-eyebrow">Prerequisite & Scalability Links</p>
              <div className="space-y-1.5 font-mono text-[11px]">
                {edges.map((edge: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2 text-[#A1A1AA]"
                  >
                    <span className="text-[#E8C547]">{edge.from}</span>
                    <ArrowRight className="h-3 w-3 text-[#52525B]" />
                    <span className="text-[#52525B] italic">[{edge.relation}]</span>
                    <ArrowRight className="h-3 w-3 text-[#52525B]" />
                    <span className="text-[#7C9CF5]">{edge.to}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="panel p-6 space-y-4 sticky top-20"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#7C9CF5]" />
                  <p className="section-eyebrow">Node Details</p>
                </div>

                <div className="space-y-1">
                  <p className="section-eyebrow text-[#7C9CF5]">{selectedNode.category}</p>
                  <h4 className="text-xl font-bold text-white tracking-tight">{selectedNode.label}</h4>
                </div>

                {(() => {
                  const cfg = (statusConfig as any)[selectedNode.status] || statusConfig.not_demonstrated_in_reviewed_scope;
                  const Icon = cfg.icon;
                  return (
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                      <span className="text-[12px] font-medium" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })()}

                <div className="panel-inner p-4 space-y-3 text-[12px] font-mono text-[#52525B]">
                  <div className="flex justify-between">
                    <span>Hierarchy Depth</span>
                    <span className="text-[#A1A1AA]">Level {selectedNode.level} of 4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="text-[#A1A1AA] capitalize">{selectedNode.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Node ID</span>
                    <span className="text-[#A1A1AA]">{selectedNode.id}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#52525B] leading-relaxed">
                  Grounding this node requires concrete implementation evidence in your reviewed codebase.
                  Missing nodes can be targeted directly in the <strong className="text-[#E8C547] font-medium">Gap Lab</strong>.
                </p>

                {/* Related edges */}
                {edges.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).length > 0 && (
                  <div className="space-y-2">
                    <p className="section-eyebrow">Relations</p>
                    <div className="space-y-1.5 text-[11px] font-mono">
                      {edges
                        .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                        .map((e, i) => (
                          <div key={i} className="flex items-center gap-2 text-[#52525B]">
                            {e.from === selectedNode.id ? (
                              <>
                                <span className="text-[#E8C547]">{e.from}</span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="italic">[{e.relation}]</span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="text-[#7C9CF5]">{e.to}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[#E8C547]">{e.from}</span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="italic">[{e.relation}]</span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="text-[#7C9CF5]">{e.to}</span>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="panel p-6 text-center"
              >
                <p className="text-[12px] text-[#52525B]">
                  Select any node in the graph to inspect prerequisite chains.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
