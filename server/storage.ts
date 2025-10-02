import { type Message, type InsertMessage, type Conversation, type InsertConversation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(limit?: number): Promise<Message[]>;
  
  // Conversations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, Message>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.messages = new Map();
    this.conversations = new Map();
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      metadata: insertMessage.metadata ?? null,
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(limit = 50): Promise<Message[]> {
    const messages = Array.from(this.messages.values())
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return messages.slice(-limit);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      updatedAt: now,
      title: insertConversation.title ?? null,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
}

export const storage = new MemStorage();
