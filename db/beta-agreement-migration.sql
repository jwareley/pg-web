CREATE TABLE IF NOT EXISTS beta_agreements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES beta_users(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('agreed','declined')),
  decline_reason TEXT,
  agreed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, stage_key)
);
CREATE INDEX IF NOT EXISTS beta_agreements_stage_idx ON beta_agreements(stage_key);
CREATE INDEX IF NOT EXISTS beta_agreements_decision_idx ON beta_agreements(decision);
