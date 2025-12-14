import { Atom, CrystalVoid, LatticeType, VoidType } from '../types';

// Distance helper
const dist = (p1: {x:number, y:number, z:number}, p2: {x:number, y:number, z:number}) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
};

// Generates atoms for a specific unit cell offset (ox, oy, oz)
const getAtomsForCell = (lattice: LatticeType, ox: number, oy: number, oz: number): Atom[] => {
  const atoms: Atom[] = [];
  
  // Corners
  for (let x = 0; x <= 1; x++) {
    for (let y = 0; y <= 1; y++) {
      for (let z = 0; z <= 1; z++) {
        atoms.push({ 
          id: `c-${ox+x}-${oy+y}-${oz+z}`, 
          x: ox + x, y: oy + y, z: oz + z, 
          variant: 'corner' 
        });
      }
    }
  }

  if (lattice === 'FCC') {
    // Face Centers
    // Corrected Z-offset usage here: using 'oz' instead of 'ox'
    atoms.push({ id: `f-xy-0-${ox}-${oy}-${oz}`, x: ox + 0.5, y: oy + 0.5, z: oz + 0, variant: 'face' });
    atoms.push({ id: `f-xy-1-${ox}-${oy}-${oz}`, x: ox + 0.5, y: oy + 0.5, z: oz + 1, variant: 'face' });
    
    atoms.push({ id: `f-yz-0-${ox}-${oy}-${oz}`, x: ox + 0, y: oy + 0.5, z: oz + 0.5, variant: 'face' });
    atoms.push({ id: `f-yz-1-${ox}-${oy}-${oz}`, x: ox + 1, y: oy + 0.5, z: oz + 0.5, variant: 'face' });
    
    atoms.push({ id: `f-xz-0-${ox}-${oy}-${oz}`, x: ox + 0.5, y: oy + 0, z: oz + 0.5, variant: 'face' });
    atoms.push({ id: `f-xz-1-${ox}-${oy}-${oz}`, x: ox + 0.5, y: oy + 1, z: oz + 0.5, variant: 'face' });
  } else if (lattice === 'BCC') {
    // Body Center
    atoms.push({ id: `b-0-${ox}-${oy}-${oz}`, x: ox + 0.5, y: oy + 0.5, z: oz + 0.5, variant: 'body' });
  }

  return atoms;
};

// Generates the single unit cell (0,0,0) for visualization
export const generateStructure = (lattice: LatticeType): Atom[] => {
  return getAtomsForCell(lattice, 0, 0, 0);
};

export const generateVoids = (lattice: LatticeType, voidType: VoidType, baseAtoms: Atom[]): CrystalVoid[] => {
  const voids: CrystalVoid[] = [];

  // 1. Define Void Locations within the Unit Cell (0..1)
  if (lattice === 'FCC') {
    if (voidType === 'Octahedral') {
      // Body Center
      voids.push({ id: 'v-oct-body', x: 0.5, y: 0.5, z: 0.5, type: 'Octahedral', formingAtoms: [] });
      // Edge centers
      const edges = [
        {x:0.5, y:0, z:0}, {x:0, y:0.5, z:0}, {x:0, y:0, z:0.5},
        {x:0.5, y:1, z:1}, {x:1, y:0.5, z:1}, {x:1, y:1, z:0.5},
        {x:0.5, y:1, z:0}, {x:0.5, y:0, z:1}, 
        {x:0, y:1, z:0.5}, {x:0, y:0.5, z:1},
        {x:1, y:0.5, z:0}, {x:1, y:0, z:0.5}
      ];
      edges.forEach((p, i) => voids.push({ id: `v-oct-edge-${i}`, ...p, type: 'Octahedral', formingAtoms: []}));

    } else {
      // Tetrahedral
      for (let x of [0.25, 0.75]) {
        for (let y of [0.25, 0.75]) {
          for (let z of [0.25, 0.75]) {
             voids.push({ id: `v-tet-${x}-${y}-${z}`, x, y, z, type: 'Tetrahedral', formingAtoms: [] });
          }
        }
      }
    }
  } else if (lattice === 'BCC') {
    if (voidType === 'Octahedral') {
      // Face centers
      const faces = [
         {x:0.5, y:0.5, z:0}, {x:0.5, y:0.5, z:1},
         {x:0.5, y:0, z:0.5}, {x:0.5, y:1, z:0.5},
         {x:0, y:0.5, z:0.5}, {x:1, y:0.5, z:0.5}
      ];
      faces.forEach((p, i) => voids.push({ id: `v-bcc-oct-face-${i}`, ...p, type: 'Octahedral', formingAtoms: [] }));
      // Edge centers
      const edges = [
        {x:0.5, y:0, z:0}, {x:0, y:0.5, z:0}, {x:0, y:0, z:0.5},
        {x:0.5, y:1, z:1}, {x:1, y:0.5, z:1}, {x:1, y:1, z:0.5},
        {x:0.5, y:1, z:0}, {x:0.5, y:0, z:1},
        {x:0, y:1, z:0.5}, {x:0, y:0.5, z:1},
        {x:1, y:0.5, z:0}, {x:1, y:0, z:0.5}
      ];
      edges.forEach((p, i) => voids.push({ id: `v-bcc-oct-edge-${i}`, ...p, type: 'Octahedral', formingAtoms: [] }));

    } else {
      // Tetrahedral BCC
       // Z=0, Z=1
      [0, 1].forEach(z => {
          voids.push({id: `vbcc-tet-z${z}-1`, x: 0.5, y: 0.25, z, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-z${z}-2`, x: 0.5, y: 0.75, z, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-z${z}-3`, x: 0.25, y: 0.5, z, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-z${z}-4`, x: 0.75, y: 0.5, z, type: 'Tetrahedral', formingAtoms: []});
      });
      // X=0, X=1
      [0, 1].forEach(x => {
          voids.push({id: `vbcc-tet-x${x}-1`, x, y: 0.25, z: 0.5, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-x${x}-2`, x, y: 0.75, z: 0.5, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-x${x}-3`, x, y: 0.5, z: 0.25, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-x${x}-4`, x, y: 0.5, z: 0.75, type: 'Tetrahedral', formingAtoms: []});
      });
      // Y=0, Y=1
      [0, 1].forEach(y => {
          voids.push({id: `vbcc-tet-y${y}-1`, x: 0.25, y, z: 0.5, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-y${y}-2`, x: 0.75, y, z: 0.5, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-y${y}-3`, x: 0.5, y, z: 0.25, type: 'Tetrahedral', formingAtoms: []});
          voids.push({id: `vbcc-tet-y${y}-4`, x: 0.5, y, z: 0.75, type: 'Tetrahedral', formingAtoms: []});
      });
    }
  }

  // 2. Find Forming Atoms (Scanning Neighbors)
  // We generate a "Supercell" neighborhood
  let rawSuperCellAtoms: Atom[] = [];
  const offsets = [-1, 0, 1];
  offsets.forEach(dx => {
    offsets.forEach(dy => {
      offsets.forEach(dz => {
        rawSuperCellAtoms = rawSuperCellAtoms.concat(getAtomsForCell(lattice, dx, dy, dz));
      });
    });
  });

  // IMPORTANT: Deduplicate atoms. 
  // Atoms at boundaries (e.g., x=0 and x=1 of adjacent cells) will have identical coordinates.
  // We need to filter them so we don't pick the same geometric atom twice.
  const uniqueSuperCellAtoms: Atom[] = [];
  const seen = new Set<string>();

  rawSuperCellAtoms.forEach(atom => {
    // Quantize coordinates to avoid floating point mismatch, use 3 decimal places
    const kx = Math.round(atom.x * 1000);
    const ky = Math.round(atom.y * 1000);
    const kz = Math.round(atom.z * 1000);
    const key = `${kx},${ky},${kz}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSuperCellAtoms.push(atom);
    }
  });

  voids.forEach(v => {
    // Sort all possible atoms by distance
    const atomsWithDist = uniqueSuperCellAtoms.map(a => ({
      atom: a,
      d: dist(v, a)
    })).sort((a,b) => a.d - b.d);

    let count = 0;
    if (lattice === 'FCC') {
        // FCC Tet: 4 neighbors (~0.433)
        // FCC Oct: 6 neighbors (0.5)
        count = (voidType === 'Tetrahedral') ? 4 : 6;
    } else {
        // BCC Tet: 4 neighbors
        // BCC Oct: 6 neighbors (2 close, 4 far)
        count = (voidType === 'Tetrahedral') ? 4 : 6;
    }

    // Slice the top 'count' closest atoms
    v.formingAtoms = atomsWithDist.slice(0, count).map(x => x.atom);
  });

  return voids;
};