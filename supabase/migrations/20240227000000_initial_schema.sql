-- Create gratitude_messages table
CREATE TABLE IF NOT EXISTS gratitude_messages (
    id BIGSERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Anonymous',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE gratitude_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for reading messages (allow all)
CREATE POLICY "Allow public read access"
    ON gratitude_messages
    FOR SELECT
    USING (true);

-- Create policy for inserting messages (allow all)
CREATE POLICY "Allow public insert access"
    ON gratitude_messages
    FOR INSERT
    WITH CHECK (true);

-- Create index on timestamp for sorting
CREATE INDEX IF NOT EXISTS idx_gratitude_messages_timestamp
    ON gratitude_messages (timestamp DESC);

-- Add comment to table
COMMENT ON TABLE gratitude_messages IS 'Stores gratitude messages with author and timestamp information';

-- Add comments to columns
COMMENT ON COLUMN gratitude_messages.message IS 'The gratitude message content';
COMMENT ON COLUMN gratitude_messages.author IS 'The name of the message author, defaults to Anonymous';
COMMENT ON COLUMN gratitude_messages.timestamp IS 'When the message was created';
COMMENT ON COLUMN gratitude_messages.created_at IS 'When the record was created in the database';