-- Add sample meetings for testing
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users table

-- First, check your user ID by running:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then replace YOUR_USER_ID below and run these inserts:

INSERT INTO meetings (owner_id, title, meeting_date, transcript) VALUES
(
  'YOUR_USER_ID', 
  'Q1 Planning Meeting', 
  '2024-01-15 14:00:00+00', 
  'This is a sample transcript for the Q1 planning meeting. We discussed our quarterly objectives, budget allocations, and key milestones. The team reviewed progress from Q4 and identified areas for improvement. Marketing presented their campaign strategy for the upcoming quarter, focusing on digital channels and customer retention. Engineering outlined the technical roadmap, including new feature development and infrastructure improvements. We also discussed hiring plans and resource allocation across departments.'
),
(
  'YOUR_USER_ID', 
  'Product Review Session', 
  '2024-01-12 10:30:00+00', 
  'Product review meeting transcript covering the latest features and user feedback. We analyzed user engagement metrics and identified key areas for improvement. The design team presented new mockups for the mobile experience, emphasizing accessibility and performance. Customer support shared insights from recent user feedback, highlighting both praise and pain points. We discussed the upcoming product roadmap and prioritized features based on user demand and business impact.'
),
(
  'YOUR_USER_ID', 
  'Weekly Team Standup', 
  '2024-01-10 09:00:00+00', 
  'Daily standup meeting with progress updates from all team members. Sarah completed the user authentication module and is moving on to data migration tasks. Mike finished the API integration and is working on error handling improvements. Lisa is finalizing the UI components and will start user testing next week. We identified a blocker with the third-party payment service and scheduled a follow-up meeting with their technical team.'
),
(
  'YOUR_USER_ID', 
  'Client Feedback Session', 
  '2024-01-08 15:30:00+00', 
  'Meeting with key clients to gather feedback on our beta release. Overall response was positive, with particular praise for the improved user interface and faster load times. Clients requested additional customization options and better reporting capabilities. We discussed implementation timelines and pricing for premium features. Action items include creating detailed requirements documents and scheduling technical feasibility sessions.'
),
(
  'YOUR_USER_ID', 
  'Marketing Strategy Meeting', 
  '2024-01-05 11:00:00+00', 
  'Strategic planning session for upcoming marketing campaigns. We reviewed Q4 performance metrics and identified successful channels for expansion. Social media engagement increased by 45% and email marketing showed strong conversion rates. The team proposed a multi-channel approach focusing on content marketing, influencer partnerships, and targeted advertising. Budget allocation was discussed for each initiative.'
);

-- Instructions:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Copy your user ID 
-- 3. Replace 'YOUR_USER_ID' with your actual ID
-- 4. Run this SQL in the Supabase SQL Editor