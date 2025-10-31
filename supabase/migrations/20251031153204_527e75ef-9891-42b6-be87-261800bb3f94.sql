-- Add updated_by column to trainings, courses, and monitoring_services tables
ALTER TABLE public.trainings ADD COLUMN updated_by uuid REFERENCES auth.users(id);
ALTER TABLE public.courses ADD COLUMN updated_by uuid REFERENCES auth.users(id);
ALTER TABLE public.monitoring_services ADD COLUMN updated_by uuid REFERENCES auth.users(id);

-- Create triggers to automatically update updated_at and updated_by
CREATE TRIGGER set_updated_at_trainings
  BEFORE UPDATE ON public.trainings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_courses
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_monitoring_services
  BEFORE UPDATE ON public.monitoring_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();