'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Meeting } from '@/lib/meetings';

interface MeetingDrawerProps {
  meeting: Meeting | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingDrawer({ meeting, isOpen, onClose }: MeetingDrawerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript'>('transcript');

  // Close drawer on ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">
                          Meeting Details
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 px-4 py-6 sm:px-6">
                      {meeting ? (
                        <div className="space-y-6">
                          {/* Meeting Title */}
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                              {meeting.title}
                            </h2>
                            
                            {/* Meeting Info */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                                <span>{formatDate(meeting.meeting_date)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <ClockIcon className="mr-2 h-5 w-5 text-gray-400" />
                                <span>{formatTime(meeting.meeting_date)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tab Navigation */}
                          <div>
                            <div className="border-b border-gray-200">
                              <nav className="-mb-px flex space-x-8">
                                <button
                                  onClick={() => setActiveTab('summary')}
                                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'summary'
                                      ? 'border-indigo-500 text-indigo-600'
                                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                                  Summary
                                </button>
                                <button
                                  onClick={() => setActiveTab('transcript')}
                                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'transcript'
                                      ? 'border-indigo-500 text-indigo-600'
                                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  <ChatBubbleLeftRightIcon className="w-5 h-5 inline mr-2" />
                                  Transcript
                                  {meeting.transcript && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Available
                                    </span>
                                  )}
                                </button>
                              </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="mt-6">
                              {activeTab === 'summary' && (
                                <div>
                                  {meeting.summary && false ? (
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                      <div 
                                        className="prose prose-sm max-w-none overflow-y-auto"
                                        style={{ maxHeight: '60vh' }}
                                      >
                                        <ReactMarkdown 
                                          remarkPlugins={[remarkGfm]}
                                          components={{
                                            h1: ({children}) => <h1 className="text-xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">{children}</h1>,
                                            h2: ({children}) => <h2 className="text-lg font-semibold text-gray-900 mt-5 mb-3 first:mt-0">{children}</h2>,
                                            h3: ({children}) => <h3 className="text-base font-medium text-gray-900 mt-4 mb-2 first:mt-0">{children}</h3>,
                                            ul: ({children}) => <ul className="list-disc pl-5 space-y-1 my-3">{children}</ul>,
                                            ol: ({children}) => <ol className="list-decimal pl-5 space-y-1 my-3">{children}</ol>,
                                            li: ({children}) => <li className="text-gray-700">{children}</li>,
                                            p: ({children}) => <p className="text-gray-700 my-3 leading-relaxed">{children}</p>,
                                            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">{children}</code>,
                                            pre: ({children}) => <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto my-3">{children}</pre>,
                                            blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3">{children}</blockquote>,
                                            input: ({type, checked, ...props}) => (
                                              type === 'checkbox' ? (
                                                <input 
                                                  type="checkbox" 
                                                  checked={checked} 
                                                  readOnly 
                                                  className="mr-2 h-4 w-4 text-indigo-600 rounded border-gray-300"
                                                  {...props}
                                                />
                                              ) : <input {...props} />
                                            ),
                                          }}
                                        >
                                          {meeting.summary}
                                        </ReactMarkdown>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                      <div className="text-center">
                                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No summary available</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                          A summary hasn't been created for this meeting yet.
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {activeTab === 'transcript' && (
                                <div>
                                  {meeting.transcript ? (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <div 
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed overflow-y-auto"
                                        style={{ maxHeight: '60vh' }}
                                      >
                                        {meeting.transcript.split('\n').map((paragraph, index) => (
                                          <p key={index} className="mb-4 last:mb-0">
                                            {paragraph}
                                          </p>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                      <div className="flex">
                                        <div className="flex-shrink-0">
                                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <div className="ml-3">
                                          <h3 className="text-sm font-medium text-yellow-800">
                                            Transcript Processing
                                          </h3>
                                          <div className="mt-2 text-sm text-yellow-700">
                                            <p>The transcript for this meeting is currently being processed. Please check back in a few minutes.</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Meeting Metadata */}
                          <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                              Meeting Information
                            </h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Meeting ID</dt>
                                <dd className="text-sm text-gray-900 font-mono">{meeting.id}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Created</dt>
                                <dd className="text-sm text-gray-900">
                                  {new Date(meeting.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No meeting selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Select a meeting from the table to view its details.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-shrink-0 justify-end px-4 py-4 border-t border-gray-200">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}