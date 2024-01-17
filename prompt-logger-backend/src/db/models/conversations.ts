export const conversationModel = `CREATE TABLE IF NOT EXISTS Conversations (
    ConversationId UUID PRIMARY KEY,
    UserId UUID,
    ConversationName String
) ENGINE = MergeTree ORDER BY ConversationId;`
