/** School Bus MS — clean professional design tokens */
export const THEME = {
  statGradients: [
    'from-slate-600 to-slate-800',
    'from-blue-600 to-blue-800',
    'from-amber-500 to-amber-600',
    'from-teal-600 to-teal-700',
  ] as const,

  brand: {
    solid: 'bg-blue-700',
    solidHover: 'hover:bg-blue-800',
    accent: 'text-blue-700',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    ring: 'focus:ring-blue-500',
  },

  superAdmin: {
    solid: 'bg-slate-700',
    accent: 'text-slate-700',
    accentBg: 'bg-slate-50',
    accentBorder: 'border-slate-200',
    hover: 'hover:border-slate-300 hover:bg-slate-50',
    gradient: 'from-slate-700 to-slate-900',
    navActive: 'bg-slate-800 text-white shadow-md',
    stat: 'from-slate-600 to-slate-800',
  },

  manager: {
    solid: 'bg-blue-700',
    accent: 'text-blue-700',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    hover: 'hover:border-blue-200 hover:bg-blue-50',
    gradient: 'from-blue-700 to-blue-900',
    navActive: 'bg-blue-700 text-white shadow-md',
    stat: 'from-blue-600 to-blue-800',
  },

  driver: {
    solid: 'bg-amber-600',
    accent: 'text-amber-700',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    hover: 'hover:border-amber-200 hover:bg-amber-50',
    gradient: 'from-amber-500 to-amber-700',
    navActive: 'bg-amber-600 text-white shadow-md',
    stat: 'from-amber-500 to-amber-600',
  },

  parent: {
    solid: 'bg-teal-600',
    accent: 'text-teal-700',
    accentBg: 'bg-teal-50',
    accentBorder: 'border-teal-200',
    hover: 'hover:border-teal-200 hover:bg-teal-50',
    gradient: 'from-teal-600 to-teal-800',
    navActive: 'bg-teal-600 text-white shadow-md',
    stat: 'from-teal-600 to-teal-700',
  },

  progress: {
    low: 'bg-teal-500',
    mid: 'bg-amber-500',
    high: 'bg-blue-600',
    bar: 'bg-blue-600',
  },

  public: {
    bg: 'from-slate-900 via-slate-800 to-blue-950',
    logo: 'from-amber-400 to-amber-500',
    logoShadow: 'shadow-amber-500/25',
    mesh: 'bg-slate-mesh',
  },
} as const;

export const DEMO_GRADIENTS = {
  'super-admin': THEME.superAdmin.stat,
  'transportation-manager': THEME.manager.stat,
  'bus-driver': THEME.driver.stat,
  'parent-guardian': THEME.parent.stat,
} as const;

// Legacy aliases used in roles.ts
export const violet = THEME.superAdmin;
export const galaxy = THEME.manager;
export const emerald = THEME.parent;
