import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  path?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, count, icon: Icon, color, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
        path ? 'hover:shadow-md cursor-pointer hover:scale-105' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
};

export default StatsCard;