import React from 'react';
import { LatticeType, VoidType } from '../types';
import { Layers, Box } from 'lucide-react';
import { COLORS } from '../constants';

interface ControlPanelProps {
  lattice: LatticeType;
  setLattice: (l: LatticeType) => void;
  voidType: VoidType;
  setVoidType: (v: VoidType) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  lattice, setLattice, voidType, setVoidType 
}) => {
  return (
    <div className="absolute top-4 left-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl max-w-xs text-slate-200 select-none">
      <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
        晶体空隙探索
      </h1>

      <div className="mb-6">
        <label className="text-xs uppercase font-semibold text-slate-500 mb-2 block">晶格结构 (Lattice)</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLattice('FCC')}
            className={`px-4 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              lattice === 'FCC' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Box size={20} /> <span className="text-sm font-bold">面心立方</span> <span className="text-[10px] opacity-75">FCC</span>
          </button>
          <button
            onClick={() => setLattice('BCC')}
            className={`px-4 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
              lattice === 'BCC' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Box size={20} /> <span className="text-sm font-bold">体心立方</span> <span className="text-[10px] opacity-75">BCC</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-xs uppercase font-semibold text-slate-500 mb-2 block">空隙类型 (Voids)</label>
        <div className="space-y-2">
           <button
            onClick={() => setVoidType('Tetrahedral')}
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-all border ${
              voidType === 'Tetrahedral' 
                ? 'bg-slate-800 border-pink-500 text-pink-400' 
                : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 font-bold"><Layers size={18} /> 四面体空隙</span>
            <span className="block w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: COLORS.voidTetra }}></span>
          </button>

          <button
            onClick={() => setVoidType('Octahedral')}
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-all border ${
              voidType === 'Octahedral' 
                ? 'bg-slate-800 border-sky-500 text-sky-400' 
                : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700'
            }`}
          >
             <span className="flex items-center gap-2 font-bold"><Layers size={18} /> 八面体空隙</span>
             <span className="block w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: COLORS.voidOcta }}></span>
          </button>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-slate-600 text-center">
        交互式 3D 演示 • 支持国内离线访问<br/>
        点击空隙即可查看其构成原子
      </div>
    </div>
  );
};

export default ControlPanel;