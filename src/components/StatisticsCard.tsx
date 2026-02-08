import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
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
    primary: 'from-primary-500 to-primary-600 text-primary-600 dark:text-primary-400',
    secondary: 'from-secondary-500 to-secondary-600 text-secondary-600 dark:text-secondary-400',
    accent: 'from-accent-500 to-accent-600 text-accent-600 dark:text-accent-400',
    green: 'from-green-500 to-green-600 text-green-600 dark:text-green-400',
    red: 'from-red-500 to-red-600 text-red-600 dark:text-red-400',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-600 dark:text-yellow-400'
  };

  const iconColorClass = colorClasses[color].split(' ')[0] + ' ' + colorClasses[color].split(' ')[1];
  const textColorClass = colorClasses[color].split(' ')[2] + ' ' + colorClasses[color].split(' ')[3];

  return (
    <div className="p-6 transition-all duration-300 bg-white border border-gray-200 dark:bg-dark-800 dark:border-dark-700 rounded-xl hover:shadow-lg hover:border-gray-300 dark:hover:border-dark-600">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${iconColorClass} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`text-sm font-medium flex items-center ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
            <span className="ml-1 text-xs">
              {trend.isPositive ? '↗' : '↘'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <p className={`text-3xl font-bold ${textColorClass}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;