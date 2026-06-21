interface TabGroupProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  accentClass?: string;
}

export default function TabGroup({
  tabs,
  activeTab,
  onChange,
  accentClass = 'bg-blue-700 text-white shadow-sm',
}: TabGroupProps) {
  return (
    <div className="nav-scroll">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === tab.id
              ? accentClass
              : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
