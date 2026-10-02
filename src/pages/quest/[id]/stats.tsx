import React from 'react';
import { Users, Target, Trophy } from 'lucide-react';
import { StatsCard } from '@/components/quest/StatsCard';

const QuestStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard 
        label="Total Participants" 
        value={stats.totalParticipants} 
        icon={Users} 
      />
      <StatsCard 
        label="Users Who Finished the Quest" 
        value={stats.uniqueUsers} 
        icon={Trophy} 
      />
      <StatsCard 
        label="Completion Rate" 
        value={`${stats.completionRate}%`} 
        icon={Target} 
      />
    </div>
  );
};

export default QuestStats;
