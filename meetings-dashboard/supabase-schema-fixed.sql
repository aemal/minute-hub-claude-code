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
CREATE POLICY meetings_owner_policy ON meetings
  FOR ALL USING (auth.uid() = owner_id);

-- Create index for better performance
CREATE INDEX idx_meetings_owner_id ON meetings(owner_id);
CREATE INDEX idx_meetings_meeting_date ON meetings(meeting_date DESC);