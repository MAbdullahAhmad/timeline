-- Example schema for the Timeline API MySQL database
CREATE TABLE IF NOT EXISTS timeline_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(120) NULL,
  category_color VARCHAR(32) NULL,
  note VARCHAR(255) NULL,
  img VARCHAR(512) NULL,
  img_link VARCHAR(512) NULL,
  description TEXT NULL,
  event_date DATE NOT NULL,
  date_label VARCHAR(120) NULL,
  level INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timeline_relationships (
  parent_id INT UNSIGNED NOT NULL,
  child_id INT UNSIGNED NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (parent_id, child_id)
);
