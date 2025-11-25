DEFINE NAMESPACE squabble;
USE NAMESPACE squabble;
DEFINE DATABASE squabble_db;
USE DATABASE squabble_db;

-- Define the User table
DEFINE TABLE user SCHEMAFULL
  PERMISSIONS
    FOR select, update, delete WHERE id = $auth.id;

DEFINE FIELD username ON user TYPE string;
DEFINE FIELD password ON user TYPE string;
DEFINE FIELD created_at ON user TYPE datetime DEFAULT time::now();

-- Ensure unique usernames
DEFINE INDEX idx_username ON user COLUMNS username UNIQUE;

-- Define the Scope for Authentication
DEFINE SCOPE allusers
  SESSION 24h
  SIGNUP ( CREATE user SET username = $username, password = crypto::argon2::generate($password) )
  SIGNIN ( SELECT * FROM user WHERE username = $username AND crypto::argon2::compare(password, $password) )
;
