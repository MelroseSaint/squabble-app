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

-- Add balance to user table
DEFINE FIELD balance ON user TYPE float DEFAULT 100.0;

-- Define the Bet table
DEFINE TABLE bet SCHEMAFULL
  PERMISSIONS
    FOR select, create, update, delete WHERE user = $auth.id;

DEFINE FIELD user ON bet TYPE record(user);
DEFINE FIELD fighterName ON bet TYPE string;
DEFINE FIELD opponentName ON bet TYPE string;
DEFINE FIELD amount ON bet TYPE float;
DEFINE FIELD odds ON bet TYPE string;
DEFINE FIELD status ON bet TYPE string ASSERT $value IN ['OPEN', 'WON', 'LOST'] DEFAULT 'OPEN';
DEFINE FIELD created_at ON bet TYPE datetime DEFAULT time::now();

-- Define the Transaction table
DEFINE TABLE transaction SCHEMAFULL
  PERMISSIONS
    FOR select, create WHERE user = $auth.id;

DEFINE FIELD user ON transaction TYPE record(user);
DEFINE FIELD type ON transaction TYPE string ASSERT $value IN ['DEPOSIT', 'WITHDRAWAL', 'BET_WIN', 'BET_LOSS'];
DEFINE FIELD amount ON transaction TYPE float;
DEFINE FIELD status ON transaction TYPE string ASSERT $value IN ['COMPLETED', 'PENDING', 'FAILED'] DEFAULT 'COMPLETED';
DEFINE FIELD description ON transaction TYPE string;
DEFINE FIELD created_at ON transaction TYPE datetime DEFAULT time::now();
