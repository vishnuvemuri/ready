import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  Gem, 
  Camera, 
  Mail, 
  Palette, 
  Calendar, 
  Mic, 
  Shirt 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Venues', icon: Building, path: '/venues' },
    { title: 'Jewelry', icon: Gem, path: '/jewelry' },
    { title: 'Photographers', icon: Camera, path: '/photographers' },
    { title: 'Invitation Cards', icon: Mail, path: '/invitation-cards' },
    { title: 'Makeup & Hairstylist', icon: Palette, path: '/makeup-hairstylist' },
    { title: 'Event Planners', icon: Calendar, path: '/event-planners' },
    { title: 'Event Anchors', icon: Mic, path: '/event-anchors' },
    { title: 'Wedding Attire', icon: Shirt, path: '/wedding-attire' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Famiory</h1>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Wedding Services
          </p>
        </div>
        
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.title}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;