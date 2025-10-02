import { type Message, type InsertMessage, type Conversation, type InsertConversation, messages, conversations } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { desc, asc, eq } from "drizzle-orm";

export interface IStorage {
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(limit?: number): Promise<Message[]>;
  
  // Conversations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
}

class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await this.db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessages(limit = 50): Promise<Message[]> {
    return await this.db
      .select()
      .from(messages)
      .orderBy(asc(messages.createdAt))
      .limit(limit);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await this.db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async getConversations(): Promise<Conversation[]> {
    return await this.db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.updatedAt));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const result = await this.db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return result[0];
  }
}

export const storage = new DatabaseStorage();
