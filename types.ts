export type LatticeType = 'FCC' | 'BCC';
export type VoidType = 'Tetrahedral' | 'Octahedral';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Atom extends Point3D {
  id: string;
  variant: 'corner' | 'face' | 'body';
}

export interface CrystalVoid extends Point3D {
  id: string;
  type: VoidType;
  formingAtoms: Atom[]; // Stores full Atom objects, including those outside the unit cell
}

export interface StructureData {
  atoms: Atom[];
  voids: CrystalVoid[];
}