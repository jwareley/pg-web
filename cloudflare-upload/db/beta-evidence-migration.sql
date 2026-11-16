CREATE TABLE IF NOT EXISTS beta_evidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES beta_users(id) ON DELETE CASCADE,
  task_id INTEGER NOT NULL REFERENCES beta_tasks(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  question_key TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS beta_evidence_user_task_question_idx
  ON beta_evidence(user_id, task_id, question_key);
