export const userModel = `CREATE TABLE IF NOT EXISTS User (
    UserId UUID PRIMARY KEY,
    Username String,
    Password String
) ENGINE = MergeTree ORDER BY UserId;`;