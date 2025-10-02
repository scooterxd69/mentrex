import { apiRequest } from "./queryClient";

export interface MCQOption {
  option: string;
  text: string;
}

export interface MCQ {
  question: string;
  options: MCQOption[];
  correctAnswer: string;
}

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  mode: "ask" | "summarize" | "mcq";
  metadata: {
    summaryPoints?: string[];
    mcqs?: MCQ[];
  } | null;
  createdAt: string;
}

export interface ApiResponse {
  userMessage: Message;
  aiMessage: Message;
}

export async function askQuestion(question: string): Promise<ApiResponse> {
  const response = await apiRequest("POST", "/api/ask", { question });
  return await response.json();
}

export async function summarizeText(text: string): Promise<ApiResponse> {
  const response = await apiRequest("POST", "/api/summarize", { text });
  return await response.json();
}

export async function generateMCQs(topic: string, count: number = 3): Promise<ApiResponse> {
  const response = await apiRequest("POST", "/api/mcq", { topic, count });
  return await response.json();
}

export async function getMessages(): Promise<Message[]> {
  const response = await apiRequest("GET", "/api/messages");
  return await response.json();
}

export async function clearMessages(): Promise<void> {
  await apiRequest("DELETE", "/api/messages");
}
