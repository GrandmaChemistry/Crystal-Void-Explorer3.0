import React, { useState } from 'react';
import CrystalCanvas from './components/CrystalCanvas';
import ControlPanel from './components/ControlPanel';
import { LatticeType, VoidType, CrystalVoid } from './types';

export default function App() {
  const [lattice, setLattice] = useState<LatticeType>('FCC');
  const [voidType, setVoidType] = useState<VoidType>('Tetrahedral');
  const [selectedVoidId, setSelectedVoidId] = useState<string | null>(null);

  const handleVoidSelect = (v: CrystalVoid | null) => {
    // If clicking same void, deselect. Else select new.
    if (v && v.id === selectedVoidId) {
        setSelectedVoidId(null);
    } else {
        setSelectedVoidId(v ? v.id : null);
    }
  };

  // Reset selection when structure changes
  const handleLatticeChange = (l: LatticeType) => {
    setLattice(l);
    setSelectedVoidId(null);
  };

  const handleVoidTypeChange = (vt: VoidType) => {
    setVoidType(vt);
    setSelectedVoidId(null);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* 3D Scene Layer */}
      <CrystalCanvas 
        lattice={lattice}
        voidType={voidType}
        onVoidSelect={handleVoidSelect}
        selectedVoidId={selectedVoidId}
      />

      {/* UI Overlay Layer */}
      <ControlPanel 
        lattice={lattice}
        setLattice={handleLatticeChange}
        voidType={voidType}
        setVoidType={handleVoidTypeChange}
      />

    </div>
  );
}