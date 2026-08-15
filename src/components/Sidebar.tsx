import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Bot, 
  Map, 
  Settings,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activePage?: string;
  // If you are using React Router, you would pass a function here or use <Link>
  onNavigate?: (pageId: string) => void; 
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Resume Analyzer', icon: FileText, id: 'resume-analyzer' },
  { name: 'Job Matching', icon: Briefcase, id: 'job-matching' },
  { name: 'AI Interview', icon: Bot, id: 'ai-interview' },
  { name: 'Career Roadmap', icon: Map, id: 'career-roadmap' },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage = 'dashboard', onNavigate }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      {/* Logo Section */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-lg font-bold leading-none">C</span>
          </div>
          <span className="text-slate-900">CareerLens</span>
        </h1>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1 ml-10">
          AI Career Assistant
        </div>
      </div>

      {/* Navigation Section */}
      <div className="px-4 py-2 text-xs font-bold text-slate-400 tracking-wider uppercase mt-4">
        Workspace
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon 
                className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Settings & Bottom Section */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        {/* Pro Upgrade Card (Matches the purple box in your video) */}
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 fill-white" />
            <span className="font-semibold text-sm">Unlock Pro</span>
          </div>
          <p className="text-xs text-indigo-100 mb-3 leading-relaxed">
            Get unlimited resume analysis and mock interviews.
          </p>
          <button className="w-full py-1.5 bg-white text-indigo-600 rounded-md text-xs font-bold hover:bg-indigo-50 transition-colors">
            Upgrade
          </button>
        </div>

        <div className="px-4 py-2 text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
          Account
        </div>
        <button
          onClick={() => onNavigate && onNavigate('settings')}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Settings className="w-5 h-5 mr-3 text-slate-400" strokeWidth={2} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;