import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { 
  Building, 
  Gem, 
  Camera, 
  Mail, 
  Palette, 
  Calendar, 
  Mic, 
  Shirt 
} from 'lucide-react';
import { useVendors } from '../contexts/VendorContext';

interface DashboardStats {
  venues: number;
  jewelry: number;
  photographers: number;
  invitationCards: number;
  makeupHairstylist: number;
  eventPlanners: number;
  eventAnchors: number;
  weddingAttire: number;
}

const Dashboard: React.FC = () => {
  const { getCategoryCount, isLoading: vendorLoading } = useVendors();
  const [stats, setStats] = useState<DashboardStats>({
    venues: 0,
    jewelry: 0,
    photographers: 0,
    invitationCards: 0,
    makeupHairstylist: 0,
    eventPlanners: 0,
    eventAnchors: 0,
    weddingAttire: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load vendor counts from context
        const vendorStats = {
          venues: getCategoryCount('venues'),
          jewelry: getCategoryCount('jewelry'),
          photographers: getCategoryCount('photographers'),
          invitationCards: getCategoryCount('invitationCards'),
          makeupHairstylist: getCategoryCount('makeupHairstylist'),
          eventPlanners: getCategoryCount('eventPlanners'),
          eventAnchors: getCategoryCount('eventAnchors'),
          weddingAttire: getCategoryCount('weddingAttire')
        };

        setStats(vendorStats);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [getCategoryCount]);

  const statsData = [
    { title: 'Venues', count: stats.venues, icon: Building, color: 'bg-purple-100 text-purple-600', path: '/venues' },
    { title: 'Jewelry', count: stats.jewelry, icon: Gem, color: 'bg-emerald-100 text-emerald-600', path: '/jewelry' },
    { title: 'Photographers', count: stats.photographers, icon: Camera, color: 'bg-blue-100 text-blue-600', path: '/photographers' },
    { title: 'Invitation Cards', count: stats.invitationCards, icon: Mail, color: 'bg-indigo-100 text-indigo-600', path: '/invitation-cards' },
    { title: 'Makeup & Hairstylist', count: stats.makeupHairstylist, icon: Palette, color: 'bg-pink-100 text-pink-600', path: '/makeup-hairstylist' },
    { title: 'Event Planners', count: stats.eventPlanners, icon: Calendar, color: 'bg-orange-100 text-orange-600', path: '/event-planners' },
    { title: 'Event Anchors', count: stats.eventAnchors, icon: Mic, color: 'bg-red-100 text-red-600', path: '/event-anchors' },
    { title: 'Wedding Attire', count: stats.weddingAttire, icon: Shirt, color: 'bg-teal-100 text-teal-600', path: '/wedding-attire' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome to Famiory Admin</h1>
            <p className="text-gray-600 mt-2">Manage your wedding services and vendors from this dashboard</p>
          </div>
          
          {(isLoading || vendorLoading) ? (
            <div className="flex justify-center items-center h-64">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <p className="ml-2 text-gray-600">Loading dashboard data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  count={stat.count}
                  icon={stat.icon}
                  color={stat.color}
                  path={stat.path}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;