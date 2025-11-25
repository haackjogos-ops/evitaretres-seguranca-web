-- Add new columns to certificates table for PDF upload functionality
ALTER TABLE certificates
ADD COLUMN uploaded_pdf_url text,
ADD COLUMN pdf_type text DEFAULT 'generated' CHECK (pdf_type IN ('generated', 'uploaded'));