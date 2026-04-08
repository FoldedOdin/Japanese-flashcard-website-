import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent' | 'green' | 'red' | 'yellow';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary',
  trend
}) => {
  const colorClasses = {
    primary: { bg: 'from-primary-500 to-primary-600', text: 'text-primary-600' },
    secondary: { bg: 'from-secondary-500 to-secondary-600', text: 'text-secondary-600' },
    accent: { bg: 'from-accent-500 to-accent-600', text: 'text-accent-600' },
    green: { bg: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600' },
    red: { bg: 'from-rose-500 to-rose-600', text: 'text-rose-600' },
    yellow: { bg: 'from-amber-500 to-amber-600', text: 'text-amber-600' }
  };

  const iconColorClass = colorClasses[color].bg;
  const textColorClass = colorClasses[color].text;

  return (
    <div className="p-6 transition-all duration-300 bg-surface border border-border rounded-2xl shadow-soft hover:shadow-paper">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${iconColorClass} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`text-sm font-medium flex items-center ${
            trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
            <span className="ml-1 text-xs">
              {trend.isPositive ? '↗' : '↘'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted">
          {title}
        </h3>
        <p className={`text-3xl font-bold ${textColorClass}`}>
          {value}
        </p>
        {subtitle && (
          <div className="text-sm text-muted">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;
