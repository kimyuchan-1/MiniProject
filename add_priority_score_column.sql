-- Add priority_score column to suggestions table
-- Priority score is calculated based on: (likes * 3) + (comments * 2) + (views * 0.1)

ALTER TABLE suggestions 
ADD COLUMN priority_score INT DEFAULT 0 AFTER comment_count;

-- Update existing records with calculated priority score
UPDATE suggestions 
SET priority_score = (COALESCE(like_count, 0) * 3) + (COALESCE(comment_count, 0) * 2) + (COALESCE(view_count, 0) * 0.1);
