import { Surreal } from 'surrealdb';

const ENDPOINT = 'wss://squabble-06dbhqbb4tpar7vu71rsnbjab8.aws-use1.surreal.cloud/rpc';
const TOKEN = 'eyJhbGciOiJQUzI1NiIsImtpZCI6IjFkNmViYjAyLWM5ZjEtNDg4Zi1iNjhjLWNlMzMzMzU4YzgyOCIsInR5cCI6IkpXVCJ9.eyJhYyI6ImNsb3VkIiwiYXVkIjoiMDZkYmhxYmI0dHBhcjd2dTcxcnNuYmphYjgiLCJleHAiOjE3NjQwNDU1NTksImlhdCI6MTc2NDA0NDk1OSwicmwiOlsiT3duZXIiXX0.Ogbei1r0tWXsxWw4s9r7lFl71tmAlg3OxYVsrohKgHwTY0D1wkp4N0nFrwzXfkupyOa80rWy56JLTUTypf1jsKCoiZ298aM38kOAoxrLPrEu45A-EXPvQ3f0RciXQX6Xao5zYtXO5w-vOlhzN1uOPbqLO56SG60ntg_VHkTZUGJzL1l3lON7VhaRUUsXfDBdggBD42a2DLL8OX-QPtUvlrU-QxBOrPKvzeFpuDT1Kdm-i3rLyxbfAwVvH4HsBZnJJKtIYv5PSxSSSaoyri8U9KS14HDCbSt-zz8fFE38Aybv7HvQ2hJvqQr_woYdzQUgqPSZf-5AwRBbry5CBe4gqw';

const db = new Surreal();

const SETUP_SQL = `
DEFINE NAMESPACE squabble;
USE NAMESPACE squabble;
DEFINE DATABASE squabble_db;
USE DATABASE squabble_db;

-- User Table
DEFINE TABLE user SCHEMAFULL
  PERMISSIONS
    FOR select, update, delete WHERE id = $auth.id;

DEFINE FIELD username ON user TYPE string;
DEFINE FIELD password ON user TYPE string;
DEFINE FIELD created_at ON user TYPE datetime DEFAULT time::now();

DEFINE INDEX idx_username ON user COLUMNS username UNIQUE;

-- Auth Scope
DEFINE SCOPE allusers
  SESSION 24h
  SIGNUP ( CREATE user SET username = $username, password = crypto::argon2::generate($password) )
  SIGNIN ( SELECT * FROM user WHERE username = $username AND crypto::argon2::compare(password, $password) )
;

-- Matches Table Permissions (Update existing table)
DEFINE TABLE matches SCHEMAFULL
  PERMISSIONS
    FOR select, create, update, delete WHERE true; -- Open for now, or restrict to auth users later
`;

async function main() {
    try {

        await db.connect(ENDPOINT);


        await db.authenticate(TOKEN);


        await db.query(SETUP_SQL);


    } catch (e) {
        console.error('Setup Failed:', e);
    } finally {
        db.close();
    }
}

main();
