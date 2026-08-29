-- LegalHub Platform - Database Initialization Script
-- PostgreSQL 15+

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON "User"("userType");
CREATE INDEX IF NOT EXISTS idx_consultations_client ON "Consultation"("clientId");
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer ON "Consultation"("lawyerId");
CREATE INDEX IF NOT EXISTS idx_consultations_status ON "Consultation"(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS idx_payments_status ON "Payment"(status);
CREATE INDEX IF NOT EXISTS idx_documents_user ON "Document"("userId");
CREATE INDEX IF NOT EXISTS idx_leads_email ON "Lead"(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON "Lead"(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON "BlogPost"("isPublished");

-- Create views for common queries

-- View: Active Lawyers
CREATE OR REPLACE VIEW active_lawyers AS
SELECT 
  lp.id,
  u."email",
  u."firstName",
  u."lastName",
  lp."averageRating",
  lp."hourlyRate",
  lp."totalCases",
  lp."isVerified"
FROM "LawyerProfile" lp
JOIN "User" u ON lp."userId" = u.id
WHERE lp."isVerified" = true
  AND u."isActive" = true;

-- View: Consultation Statistics
CREATE OR REPLACE VIEW consultation_stats AS
SELECT 
  DATE(c."scheduledDate") as consultation_date,
  COUNT(*) as total_consultations,
  COUNT(CASE WHEN c.status = 'COMPLETED' THEN 1 END) as completed,
  COUNT(CASE WHEN c.status = 'CANCELLED' THEN 1 END) as cancelled,
  SUM(c.amount) as total_amount
FROM "Consultation" c
GROUP BY DATE(c."scheduledDate");

-- View: Revenue by Lawyer
CREATE OR REPLACE VIEW lawyer_revenue AS
SELECT 
  lp.id,
  u."firstName",
  u."lastName",
  COUNT(DISTINCT c.id) as consultations,
  SUM(p.amount) as total_revenue,
  AVG(p.amount) as avg_consultation_value
FROM "LawyerProfile" lp
JOIN "User" u ON lp."userId" = u.id
LEFT JOIN "Consultation" c ON lp.id = c."lawyerId"
LEFT JOIN "Payment" p ON c.id = p."consultationId" AND p.status = 'COMPLETED'
GROUP BY lp.id, u."firstName", u."lastName";

-- Create function for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_updated_at BEFORE UPDATE ON "Consultation"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_updated_at BEFORE UPDATE ON "Payment"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default services
INSERT INTO "Service" (id, name, description, category, "basePrice", "estimatedDuration", "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'Legal Consultation', 'General legal advice and consultation', 'CONSULTATION', 100, 60, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Document Review', 'Professional review and analysis of legal documents', 'DOCUMENT_REVIEW', 150, 90, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Contract Drafting', 'Custom contract creation and drafting', 'DRAFTING', 200, 120, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Legal Representation', 'Full legal representation and advocacy', 'REPRESENTATION', 300, 180, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Notarization', 'Notarization of documents', 'NOTARIZATION', 50, 30, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Will & Estate Planning', 'Estate planning and will preparation', 'ESTATE_PLANNING', 250, 120, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert default email templates
INSERT INTO "EmailTemplate" (id, name, subject, "htmlContent", "textContent", "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'welcome_email', 'Welcome to LegalHub', '<html><body>Welcome to LegalHub!</body></html>', 'Welcome to LegalHub!', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'consultation_confirmation', 'Consultation Confirmed', '<html><body>Your consultation has been confirmed.</body></html>', 'Your consultation has been confirmed.', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'payment_receipt', 'Payment Receipt', '<html><body>Thank you for your payment.</body></html>', 'Thank you for your payment.', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'password_reset', 'Reset Your Password', '<html><body>Click the link to reset your password.</body></html>', 'Click the link to reset your password.', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create backup procedure
CREATE OR REPLACE FUNCTION create_backup()
RETURNS void AS $$
BEGIN
  -- Backup procedure - typically handled by pg_dump in production
  RAISE NOTICE 'Backup created at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust for your deployment)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lawyer_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lawyer_app;

COMMIT;
