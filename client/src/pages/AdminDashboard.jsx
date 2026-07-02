import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../store/authStore';

// Tabs
const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'bookings', label: 'Bookings', icon: 'hotel' },
  { id: 'dining', label: 'Dining', icon: 'restaurant' },
  { id: 'rooms', label: 'Rooms', icon: 'bed' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useAuthStore((s) => s.user);

  // Fetch data
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.stats;
    },
    enabled: activeTab === 'overview',
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const res = await api.get('/bookings');
      return res.data.bookings;
    },
    enabled: activeTab === 'bookings',
  });

  const { data: diningData, isLoading: diningLoading } = useQuery({
    queryKey: ['adminDining'],
    queryFn: async () => {
      const res = await api.get('/dining/reservations');
      return res.data.reservations;
    },
    enabled: activeTab === 'dining',
  });

  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ['adminRooms'],
    queryFn: async () => {
      const res = await api.get('/rooms');
      return res.data.rooms;
    },
    enabled: activeTab === 'rooms',
  });

  // Renderers for each tab
  const renderOverview = () => {
    if (statsLoading) return <div className="text-on-surface-variant">Loading stats...</div>;
    if (!statsData) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${statsData.revenue.toLocaleString('en-IN')}`} icon="payments" />
        <StatCard title="Total Bookings" value={statsData.totalBookings} icon="hotel" />
        <StatCard title="Dining Reservations" value={statsData.totalDiningReservations} icon="restaurant" />
        <StatCard title="Total Rooms" value={statsData.totalRooms} icon="meeting_room" />
      </div>
    );
  };

  const renderBookings = () => {
    if (bookingsLoading) return <div className="text-on-surface-variant">Loading bookings...</div>;
    if (!bookingsData) return null;

    return (
      <div className="bg-surface-container-low rounded-sm overflow-hidden border border-secondary/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md text-sm">
            <thead className="bg-secondary/10 border-b border-secondary/20">
              <tr>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Guest</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Room</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Dates</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Amount</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {bookingsData.map((b) => (
                <tr key={b._id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-primary font-semibold">{b.guestInfo.name}</p>
                    <p className="text-on-surface-variant text-xs">{b.guestInfo.email}</p>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{b.room?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {new Date(b.checkIn).toLocaleDateString('en-GB')} - {new Date(b.checkOut).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-label-caps tracking-wider rounded-sm ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDining = () => {
    if (diningLoading) return <div className="text-on-surface-variant">Loading dining reservations...</div>;
    if (!diningData) return null;

    return (
      <div className="bg-surface-container-low rounded-sm overflow-hidden border border-secondary/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md text-sm">
            <thead className="bg-secondary/10 border-b border-secondary/20">
              <tr>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Name</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Contact</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Date & Time</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Guests</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {diningData.map((d) => (
                <tr key={d._id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-semibold text-primary">{d.name}</td>
                  <td className="px-6 py-4">
                    <p className="text-on-surface-variant">{d.email}</p>
                    <p className="text-on-surface-variant text-xs">{d.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {new Date(d.date).toLocaleDateString('en-GB')} at {d.time}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{d.guests}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-label-caps tracking-wider rounded-sm ${
                      d.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {d.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRooms = () => {
    if (roomsLoading) return <div className="text-on-surface-variant">Loading rooms...</div>;
    if (!roomsData) return null;

    return (
      <div className="bg-surface-container-low rounded-sm overflow-hidden border border-secondary/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md text-sm">
            <thead className="bg-secondary/10 border-b border-secondary/20">
              <tr>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Room Name</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Tier</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Price/Night</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Max Guests</th>
                <th className="px-6 py-4 font-label-caps tracking-widest text-[11px] text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {roomsData.map((r) => (
                <tr key={r._id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-semibold text-primary">{r.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{r.tier}</td>
                  <td className="px-6 py-4 text-on-surface-variant">₹{r.pricePerNight?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{r.maxGuests}</td>
                  <td className="px-6 py-4">
                    <button className="text-secondary hover:text-primary transition-colors text-xs font-label-caps tracking-wider mr-4">EDIT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — Delhi Line Hotel</title>
      </Helmet>
      
      <div className="min-h-screen bg-surface pt-24 pb-20 px-5 md:px-[80px]">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <p className="font-label-caps text-secondary tracking-widest text-xs mb-2">MANAGEMENT PORTAL</p>
              <h1 className="font-display-lg text-primary text-4xl">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">admin_panel_settings</span>
              <span className="font-label-caps text-on-surface-variant tracking-wider text-xs">Logged in as {user?.name}</span>
            </div>
          </div>

          <div className="gold-divider mb-10" />

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-sm font-label-caps tracking-widest text-xs transition-colors whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'bg-primary text-on-primary' 
                        : 'text-on-surface-variant hover:bg-secondary/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'bookings' && renderBookings()}
              {activeTab === 'dining' && renderDining()}
              {activeTab === 'rooms' && renderRooms()}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// Simple stat card component
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-surface-container-low p-6 rounded-sm border border-secondary/20 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-label-caps text-on-surface-variant tracking-widest text-[10px]">{title}</h3>
        <span className="material-symbols-outlined text-secondary">{icon}</span>
      </div>
      <p className="font-display-lg text-primary text-3xl">{value}</p>
    </div>
  );
}
