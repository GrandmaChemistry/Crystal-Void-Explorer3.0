export const ATOM_RADIUS = 0.2;
export const VOID_RADIUS = 0.08;

export const COLORS = {
  atom: '#f97316', // Orange-500 (Vibrant Orange Fruit Color)
  atomHighlight: '#fbbf24', // Amber-400 (Brighter Yellow-Orange for highlight)
  voidTetra: '#f472b6', // Pink
  voidOcta: '#38bdf8', // Sky Blue
  connector: '#ffffff', // White connections
};

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const SYSTEM_INSTRUCTION = `
You are an expert crystallography professor. 
Explain concepts clearly and concisely for students.
Focus on the geometry of voids (interstices) in metal lattices.
When asked, assume the user is looking at a 3D visualization.
Use Markdown for formatting.
`;