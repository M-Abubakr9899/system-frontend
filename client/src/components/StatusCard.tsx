import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  icon: Icon,
  children,
  className,
}) => {
  return (
    <Card className={cn(
      "bg-card border border-gray-800 hover:border-primary transition-colors duration-300",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Icon className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
  max?: number;
  showProgress?: boolean;
}

export const StatItem: React.FC<StatItemProps> = ({ 
  label, 
  value, 
  max, 
  showProgress = true 
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-primary">{value}</span>
      </div>
      {showProgress && max && (
        <ProgressBar value={Number(value)} max={max} />
      )}
    </div>
  );
};

export default StatusCard;
