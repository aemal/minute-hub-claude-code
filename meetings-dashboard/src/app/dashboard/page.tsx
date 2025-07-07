'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import MeetingsTable from '@/components/MeetingsTable';
import MeetingDrawer from '@/components/MeetingDrawer';
import AddMeetingModal from '@/components/AddMeetingModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Meeting } from '@/lib/meetings';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleCloseDrawer = () => {
    setSelectedMeeting(null);
  };

  const handleMeetingAdded = () => {
    setRefreshKey(prev => prev + 1); // Trigger table refresh
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="mt-2 text-gray-600">
                Here are your recent meetings and transcripts.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Meeting
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Meetings</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">This Week</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Hours Transcribed</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
            </div>
          </div>

          <MeetingsTable 
            key={refreshKey} 
            onMeetingClick={handleMeetingClick} 
          />
        </div>
      </div>

      {/* Meeting Drawer */}
      <MeetingDrawer 
        meeting={selectedMeeting}
        isOpen={!!selectedMeeting}
        onClose={handleCloseDrawer}
      />

      {/* Add Meeting Modal */}
      <AddMeetingModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onMeetingAdded={handleMeetingAdded}
      />
    </div>
  );
}