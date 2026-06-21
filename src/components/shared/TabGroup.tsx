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
    <div className="nav-scroll -mx-1 px-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-[0.98] 2xs:px-4 2xs:text-sm ${
            activeTab === tab.id
              ? accentClass
              : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] 2xs:ml-2 2xs:px-2 2xs:text-xs ${
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
