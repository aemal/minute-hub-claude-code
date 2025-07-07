-- Create meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_date TIMESTAMPTZ NOT NULL,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access their own meetings
CREATE POLICY "Users can only access their own meetings" ON meetings
  FOR ALL USING (auth.uid() = owner_id);

-- Create index for better performance
CREATE INDEX idx_meetings_owner_id ON meetings(owner_id);
CREATE INDEX idx_meetings_meeting_date ON meetings(meeting_date DESC);

-- Insert sample data (optional - for testing)
INSERT INTO meetings (owner_id, title, meeting_date, transcript) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Q1 Planning Meeting', '2024-01-15 14:00:00+00', 'This is a sample transcript for the Q1 planning meeting. We discussed goals, objectives, and key milestones for the quarter. The team seems aligned on the priorities and next steps.'),
  ('00000000-0000-0000-0000-000000000000', 'Product Review', '2024-01-10 10:30:00+00', 'Product review meeting transcript. We covered the latest features, user feedback, and upcoming roadmap items. The engineering team provided updates on technical debt and performance improvements.'),
  ('00000000-0000-0000-0000-000000000000', 'Team Standup', '2024-01-08 09:00:00+00', 'Daily standup meeting. Each team member shared their progress, blockers, and plans for the day. We identified a few cross-team dependencies that need attention.');

-- Note: Replace '00000000-0000-0000-0000-000000000000' with actual user IDs after creating test users