CREATE TABLE IF NOT EXISTS beta_incident_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_number TEXT NOT NULL,
  description TEXT NOT NULL,
  app_metadata TEXT,
  log_object_key TEXT NOT NULL UNIQUE,
  log_original_name TEXT NOT NULL,
  log_content_type TEXT NOT NULL,
  log_size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS beta_incidents_number_idx ON beta_incident_reports(incident_number);
CREATE INDEX IF NOT EXISTS beta_incidents_created_idx ON beta_incident_reports(created_at);
