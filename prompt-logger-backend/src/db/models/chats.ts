export const chatModel = `CREATE TABLE IF NOT EXISTS Chats (
    ChatId UUID PRIMARY KEY,
    ConversationId UUID,
    CreatedAt DateTime,
    Status String,
    Request String,
    Response String,
    Model String,
    TotalTokens UInt32,
    PromptTokens UInt32,
    CompletionTokens UInt32
) ENGINE = MergeTree ORDER BY ChatId;`;