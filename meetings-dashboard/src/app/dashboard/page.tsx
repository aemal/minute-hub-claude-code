'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import MeetingsTable from '@/components/MeetingsTable';
import MeetingDrawer from '@/components/MeetingDrawer';
import type { Meeting } from '@/lib/meetings';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleCloseDrawer = () => {
    setSelectedMeeting(null);
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="mt-2 text-gray-600">
              Here are your recent meetings and transcripts.
            </p>
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

          <MeetingsTable onMeetingClick={handleMeetingClick} />
        </div>
      </div>

      {/* Meeting Drawer */}
      <MeetingDrawer 
        meeting={selectedMeeting}
        isOpen={!!selectedMeeting}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}