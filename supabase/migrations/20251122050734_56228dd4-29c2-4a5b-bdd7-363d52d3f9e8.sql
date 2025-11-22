-- Add evaluator role to the app_role enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'evaluator') THEN
    ALTER TYPE app_role ADD VALUE 'evaluator';
  END IF;
END $$;