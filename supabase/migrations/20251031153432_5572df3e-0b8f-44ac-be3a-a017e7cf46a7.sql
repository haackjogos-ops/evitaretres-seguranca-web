-- Add logo_size column to trainings, courses, and monitoring_services tables
ALTER TABLE public.trainings ADD COLUMN logo_size text DEFAULT 'small' CHECK (logo_size IN ('small', 'medium', 'large'));
ALTER TABLE public.courses ADD COLUMN logo_size text DEFAULT 'small' CHECK (logo_size IN ('small', 'medium', 'large'));
ALTER TABLE public.monitoring_services ADD COLUMN logo_size text DEFAULT 'small' CHECK (logo_size IN ('small', 'medium', 'large'));