'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { meetingsService } from '@/lib/meetings';
import { useAuth } from '@/contexts/AuthContext';

interface AddMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingAdded: () => void;
}

export default function AddMeetingModal({ isOpen, onClose, onMeetingAdded }: AddMeetingModalProps) {
  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const dateTime = new Date(`${meetingDate}T${meetingTime}`).toISOString();
      
      const { error: createError } = await meetingsService.createMeeting({
        owner_id: user.id,
        title,
        meeting_date: dateTime,
        transcript: transcript || null,
        // summary: summary || null, // Temporarily disabled until schema cache refreshes
      });

      if (createError) {
        setError(createError.message);
      } else {
        // Reset form
        setTitle('');
        setMeetingDate('');
        setMeetingTime('');
        setTranscript('');
        setSummary('');
        onMeetingAdded();
        onClose();
      }
    } catch (err: any) {
      setError('Failed to create meeting');
    }

    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setMeetingDate('');
      setMeetingTime('');
      setTranscript('');
      setSummary('');
      setError('');
      onClose();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-6">
                      Add New Meeting
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Title */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Meeting Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          placeholder="e.g., Weekly Team Standup"
                        />
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date *
                          </label>
                          <input
                            type="date"
                            id="date"
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                            Time *
                          </label>
                          <input
                            type="time"
                            id="time"
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                          Meeting Summary (Markdown)
                        </label>
                        <textarea
                          id="summary"
                          rows={8}
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          placeholder="## Key Decisions
- Decision 1
- Decision 2

## Action Items
- [ ] Task 1 - Assigned to John
- [ ] Task 2 - Due Friday

## Next Steps
Details about next meeting..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Use Markdown formatting for better presentation (headings, lists, checkboxes, etc.)
                        </p>
                      </div>

                      {/* Transcript */}
                      <div>
                        <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">
                          Full Transcript (Optional)
                        </label>
                        <textarea
                          id="transcript"
                          rows={6}
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          placeholder="Full meeting transcript or notes..."
                        />
                      </div>

                      {error && (
                        <div className="rounded-md bg-red-50 p-4">
                          <div className="text-sm text-red-700">{error}</div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
                        >
                          {loading ? 'Creating...' : 'Create Meeting'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={handleClose}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}