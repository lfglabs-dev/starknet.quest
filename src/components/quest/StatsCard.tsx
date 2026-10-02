import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, className }) => {
  return (
    <div className={cn(
      "relative flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-secondary/50 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  );
};
