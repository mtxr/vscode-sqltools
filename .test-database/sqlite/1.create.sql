CREATE TABLE contacts (
  contact_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL UNIQUE
);
