import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere } from '@react-three/drei';
import { Atom, CrystalVoid, LatticeType } from '../types';
import { generateStructure, generateVoids } from '../services/crystalMath';
import { ATOM_RADIUS, VOID_RADIUS, COLORS } from '../constants';

interface CrystalCanvasProps {
  lattice: LatticeType;
  voidType: 'Tetrahedral' | 'Octahedral';
  onVoidSelect: (v: CrystalVoid | null) => void;
  selectedVoidId: string | null;
}

const AtomMesh: React.FC<{ atom: Atom; isHighlighted: boolean; opacity: number }> = ({ atom, isHighlighted, opacity }) => {
  return (
    <Sphere args={[ATOM_RADIUS, 32, 32]} position={[atom.x, atom.y, atom.z]}>
      {/* Material adjusted to look like an orange fruit: Rough, non-metallic, vibrant */}
      <meshStandardMaterial
        color={isHighlighted ? COLORS.atomHighlight : COLORS.atom}
        metalness={0.1} 
        roughness={0.6} // Fruit skin texture
        emissive={isHighlighted ? COLORS.atomHighlight : '#fb923c'} // Slight orange glow for visibility
        emissiveIntensity={isHighlighted ? 0.6 : 0.2} // Base ambient glow
        transparent={opacity < 1}
        opacity={opacity}
      />
    </Sphere>
  );
};

const VoidMesh: React.FC<{ v: CrystalVoid; isSelected: boolean; onClick: () => void }> = ({ v, isSelected, onClick }) => {
  return (
    <group position={[v.x, v.y, v.z]}>
      <Sphere args={[VOID_RADIUS, 16, 16]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <meshStandardMaterial
          color={v.type === 'Tetrahedral' ? COLORS.voidTetra : COLORS.voidOcta}
          emissive={v.type === 'Tetrahedral' ? COLORS.voidTetra : COLORS.voidOcta}
          emissiveIntensity={isSelected ? 2 : 0.5}
          toneMapped={false}
        />
      </Sphere>
    </group>
  );
};

const CrystalScene: React.FC<CrystalCanvasProps> = ({ lattice, voidType, onVoidSelect, selectedVoidId }) => {
  const atoms = useMemo(() => generateStructure(lattice), [lattice]);
  const voids = useMemo(() => generateVoids(lattice, voidType, atoms), [lattice, voidType]);

  const selectedVoid = useMemo(() => 
    voids.find(v => v.id === selectedVoidId), 
  [voids, selectedVoidId]);

  return (
    <>
      {/* Even Lighting Setup: Hemisphere light + Soft directional lights */}
      <hemisphereLight skyColor="#ffffff" groundColor="#fb923c" intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, -5, -10]} intensity={0.5} color="#ffdcb8" />
      <ambientLight intensity={0.5} />
      
      <group position={[-0.5, -0.5, -0.5]}>
        {/* Unit Cell Frame */}
        <Line points={[[0,0,0], [1,0,0], [1,1,0], [0,1,0], [0,0,0]]} color="#666" lineWidth={2} />
        <Line points={[[0,0,1], [1,0,1], [1,1,1], [0,1,1], [0,0,1]]} color="#666" lineWidth={2} />
        <Line points={[[0,0,0], [0,0,1]]} color="#666" lineWidth={2} />
        <Line points={[[1,0,0], [1,0,1]]} color="#666" lineWidth={2} />
        <Line points={[[1,1,0], [1,1,1]]} color="#666" lineWidth={2} />
        <Line points={[[0,1,0], [0,1,1]]} color="#666" lineWidth={2} />

        {/* Base Unit Cell Atoms */}
        {atoms.map(atom => {
             // Check if this atom is involved in the selected void
             const isForming = selectedVoid?.formingAtoms.some(fa => 
                Math.abs(fa.x - atom.x) < 0.001 && 
                Math.abs(fa.y - atom.y) < 0.001 && 
                Math.abs(fa.z - atom.z) < 0.001
             ) ?? false;

            return (
              <AtomMesh 
                key={atom.id} 
                atom={atom} 
                isHighlighted={isForming}
                opacity={1}
              />
            );
        })}

        {/* Explicitly Render Forming Atoms for Selected Void (Handles External Atoms) */}
        {selectedVoid && selectedVoid.formingAtoms.map((atom, idx) => {
            // Epsilon check for float precision
            const isInsideUnitCell = atom.x > -0.001 && atom.x < 1.001 && 
                                     atom.y > -0.001 && atom.y < 1.001 && 
                                     atom.z > -0.001 && atom.z < 1.001;
            
            // If it is OUTSIDE, we must render it here to ensure the full void structure is shown.
            if (!isInsideUnitCell) {
                return (
                    <AtomMesh 
                        key={`forming-${atom.id}-${idx}`} 
                        atom={atom} 
                        isHighlighted={true}
                        opacity={1}
                    />
                );
            }
            return null;
        })}

        {/* Voids */}
        {voids.map(v => (
          <VoidMesh 
            key={v.id} 
            v={v} 
            isSelected={selectedVoidId === v.id}
            onClick={() => onVoidSelect(v)}
          />
        ))}

        {/* Connection Lines */}
        {selectedVoid && selectedVoid.formingAtoms.map((atom, i) => {
            return (
                <Line
                    key={`line-${selectedVoid.id}-${i}`}
                    points={[[selectedVoid.x, selectedVoid.y, selectedVoid.z], [atom.x, atom.y, atom.z]]}
                    color={COLORS.connector}
                    lineWidth={3}
                    transparent
                    opacity={0.8}
                />
            );
        })}
      </group>

      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI} />
    </>
  );
};

export default function CrystalCanvas(props: CrystalCanvasProps) {
  return (
    <div className="w-full h-full bg-slate-900 cursor-default">
      <Canvas camera={{ position: [3.5, 3.5, 3.5], fov: 40 }}>
        <CrystalScene {...props} />
      </Canvas>
      <div className="absolute bottom-4 right-4 text-slate-500 text-xs pointer-events-none select-none">
        拖动旋转 • 滚轮缩放 • 点击空隙查看详情
      </div>
    </div>
  );
}