/** Public-facing system information for Home page */
export const systemFlowSteps = [
  {
    step: 1,
    title: 'Register or Sign In',
    description: 'Create an account or log in with your role. Four demo accounts are ready — one for each role in the system.',
    icon: '🔐',
    color: 'from-slate-600 to-slate-800',
  },
  {
    step: 2,
    title: 'Choose Your Role',
    description: 'Super Admin, Transportation Manager, Bus Driver, or Parent/Guardian — each role gets a dedicated dashboard and tools.',
    icon: '👤',
    color: 'from-blue-600 to-blue-800',
  },
  {
    step: 3,
    title: 'Open Your Dashboard',
    description: 'View live stats, quick actions, and navigate via the responsive sidebar to every feature your role needs.',
    icon: '📊',
    color: 'from-amber-500 to-amber-600',
  },
  {
    step: 4,
    title: 'Manage Transportation',
    description: 'Handle buses, routes, schedules, attendance, notifications, and reports — all in one connected workflow.',
    icon: '🚌',
    color: 'from-teal-600 to-teal-700',
  },
] as const;

export const systemFeatures = [
  { icon: '👥', title: 'User Management', description: 'Registration, login, role-based access, and profile management' },
  { icon: '🚌', title: 'Bus Management', description: 'Bus registration, capacity tracking, status monitoring, and maintenance' },
  { icon: '👨‍✈️', title: 'Driver Management', description: 'Driver profiles, assignments, and performance records' },
  { icon: '🗺️', title: 'Route Management', description: 'Route creation, pickup/drop-off points, scheduling, and monitoring' },
  { icon: '👨‍🎓', title: 'Student Transport', description: 'Passenger lists, bus assignments, boarding records, and history' },
  { icon: '✅', title: 'Attendance', description: 'Boarding and drop-off tracking with daily records and reports' },
  { icon: '🔔', title: 'Notifications', description: 'Bus arrivals, route updates, schedule reminders, and emergency alerts' },
  { icon: '📈', title: 'Reports & Analytics', description: 'Transportation, attendance, route, driver, and utilization reports' },
] as const;

export const roleSummaries = [
  {
    role: 'super-admin' as const,
    title: 'Super Admin',
    icon: '👑',
    gradient: 'from-slate-700 to-slate-900',
    accent: 'text-slate-700',
    features: ['Full system access', 'Manage users & roles', 'Configure settings', 'Backup & restore data'],
  },
  {
    role: 'transportation-manager' as const,
    title: 'Transportation Manager',
    icon: '📋',
    gradient: 'from-blue-700 to-blue-900',
    accent: 'text-blue-700',
    features: ['Manage bus routes', 'Assign buses & drivers', 'Monitor operations', 'Handle requests'],
  },
  {
    role: 'bus-driver' as const,
    title: 'Bus Driver',
    icon: '🚌',
    gradient: 'from-amber-500 to-amber-700',
    accent: 'text-amber-700',
    features: ['View assigned routes', 'Record attendance', 'Update trip status', 'Submit trip reports'],
  },
  {
    role: 'parent-guardian' as const,
    title: 'Parent / Guardian',
    icon: '👨‍👩‍👧',
    gradient: 'from-teal-600 to-teal-800',
    accent: 'text-teal-700',
    features: ['Track bus schedules', 'View boarding records', 'Receive notifications', 'Submit requests'],
  },
] as const;
