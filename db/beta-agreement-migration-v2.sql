CREATE TABLE IF NOT EXISTS beta_agreement_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version_number TEXT NOT NULL UNIQUE,
  agreement_text TEXT NOT NULL,
  privacy_version TEXT NOT NULL,
  privacy_text TEXT NOT NULL,
  effective_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS beta_agreement_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES beta_users(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL,
  agreement_version TEXT NOT NULL,
  privacy_version TEXT NOT NULL,
  agreement_text TEXT NOT NULL,
  privacy_text TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  public_name TEXT,
  adult_confirmed INTEGER NOT NULL,
  risk_confirmed INTEGER NOT NULL,
  credit_opt_out INTEGER NOT NULL,
  application_data TEXT NOT NULL,
  stage_requirements TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('agreed','declined')),
  decline_reason TEXT,
  submitted_at TEXT NOT NULL,
  withdrawal_status TEXT NOT NULL DEFAULT 'active',
  completion_status TEXT NOT NULL DEFAULT 'in_progress',
  promo_code TEXT,
  promo_available_at TEXT
);
CREATE INDEX IF NOT EXISTS beta_agreement_records_user_stage_idx ON beta_agreement_records(user_id,stage_key,submitted_at);
CREATE TABLE IF NOT EXISTS beta_agreement_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agreement_record_id INTEGER NOT NULL REFERENCES beta_agreement_records(id),
  admin_user_id INTEGER REFERENCES beta_users(id),
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
