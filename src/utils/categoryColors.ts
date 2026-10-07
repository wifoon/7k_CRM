export interface CategoryColorDef {
  name: string;
  value: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  ring: string;
}

export const CATEGORY_COLOR_PALETTE: Record<string, CategoryColorDef> = {
  purple: {
    name: 'Fioletowy',
    value: 'purple',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-800/50',
    dot: 'bg-purple-400',
    ring: 'ring-purple-500',
  },
  sky: {
    name: 'Błękitny',
    value: 'sky',
    bg: 'bg-sky-950/40',
    text: 'text-sky-300',
    border: 'border-sky-800/50',
    dot: 'bg-sky-400',
    ring: 'ring-sky-500',
  },
  emerald: {
    name: 'Szmaragdowy',
    value: 'emerald',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-800/50',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500',
  },
  amber: {
    name: 'Bursztynowy',
    value: 'amber',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-800/50',
    dot: 'bg-amber-400',
    ring: 'ring-amber-500',
  },
  blue: {
    name: 'Niebieski',
    value: 'blue',
    bg: 'bg-blue-950/40',
    text: 'text-blue-300',
    border: 'border-blue-800/50',
    dot: 'bg-blue-400',
    ring: 'ring-blue-500',
  },
  rose: {
    name: 'Różany / Czerwony',
    value: 'rose',
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-800/50',
    dot: 'bg-rose-400',
    ring: 'ring-rose-500',
  },
  slate: {
    name: 'Grafitowy',
    value: 'slate',
    bg: 'bg-slate-800/70',
    text: 'text-slate-300',
    border: 'border-slate-700/60',
    dot: 'bg-slate-400',
    ring: 'ring-slate-500',
  },
  violet: {
    name: 'Indygo',
    value: 'violet',
    bg: 'bg-violet-950/40',
    text: 'text-violet-300',
    border: 'border-violet-800/50',
    dot: 'bg-violet-400',
    ring: 'ring-violet-500',
  },
};

export const DEFAULT_CATEGORY_STYLE: CategoryColorDef = {
  name: 'Domyślny',
  value: 'slate',
  bg: 'bg-slate-800/70',
  text: 'text-slate-300',
  border: 'border-slate-700/60',
  dot: 'bg-slate-400',
  ring: 'ring-slate-500',
};

/**
 * Zwraca definicję stylu dla zadanego koloru lub ID kategorii
 */
export function getCategoryColorDef(colorKey?: string): CategoryColorDef {
  if (!colorKey) return DEFAULT_CATEGORY_STYLE;

  // Obsługa nazw Tailwind np. "bg-blue-500" -> "blue"
  const cleanKey = colorKey.replace('bg-', '').replace('-500', '').toLowerCase();

  return CATEGORY_COLOR_PALETTE[cleanKey] || DEFAULT_CATEGORY_STYLE;
}
