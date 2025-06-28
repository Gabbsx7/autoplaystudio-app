-- Add is_primary column to client_users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'client_users'
        AND column_name = 'is_primary'
    ) THEN
        ALTER TABLE public.client_users
        ADD COLUMN is_primary boolean DEFAULT false;
    END IF;
END $$;

-- Update existing records to set at least one primary user per client
-- This sets the first user (by created_at) as primary for each client
UPDATE client_users cu
SET is_primary = true
WHERE cu.created_at = (
    SELECT MIN(created_at)
    FROM client_users cu2
    WHERE cu2.client_id = cu.client_id
)
AND NOT EXISTS (
    SELECT 1
    FROM client_users cu3
    WHERE cu3.client_id = cu.client_id
    AND cu3.is_primary = true
); 