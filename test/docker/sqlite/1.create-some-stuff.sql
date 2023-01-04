-- @conn SQLite
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS contacts_metadata;
DROP VIEW IF EXISTS contacts_view_$[env];

CREATE TABLE contacts (
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL UNIQUE,
  id INTEGER PRIMARY KEY
);

CREATE TABLE contacts_metadata (
  contact_id INTEGER NOT NULL,
  metadata TEXT,
  FOREIGN KEY(contact_id) REFERENCES contact(id)
);

CREATE VIEW contacts_view_$[env]
AS
SELECT
*
FROM
contacts
LEFT JOIN contacts_metadata ON contacts.id = contacts_metadata.contact_id;
