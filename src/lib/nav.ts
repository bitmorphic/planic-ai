import {
  LayoutDashboard,
  Radar,
  Mail,
  Workflow,
  Sparkles,
  Siren,
  Briefcase,
  Receipt,
  Dna,
  Target,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  color?: string;
  module: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Command Center', href: '/app', icon: LayoutDashboard, module: '01', color: '#4F46E5' },
  { label: 'Deadline Radar', href: '/app/deadlines', icon: Radar, badge: '6', module: '02', color: '#EF4444' },
  { label: 'Gmail Intelligence', href: '/app/gmail', icon: Mail, badge: '2', module: '03', color: '#06B6D4' },
  { label: 'AI Planner', href: '/app/planner', icon: Workflow, module: '04', color: '#8B5CF6' },
  { label: 'Planic Mode', href: '/app/planic', icon: Sparkles, module: '05', color: '#EC4899' },
  { label: 'Panic Mode', href: '/app/panic', icon: Siren, badge: '!', module: '06', color: '#EF4444' },
  { label: 'Interview Copilot', href: '/app/interviews', icon: Briefcase, module: '07', color: '#6366F1' },
  { label: 'Bill Guardian', href: '/app/bills', icon: Receipt, badge: '3', module: '08', color: '#22C55E' },
  { label: 'Productivity DNA', href: '/app/dna', icon: Dna, module: '09', color: '#8B5CF6' },
  { label: 'Goals & Habits', href: '/app/goals', icon: Target, module: '10', color: '#F59E0B' },
];
