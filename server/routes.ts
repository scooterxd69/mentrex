import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { huggingFaceService } from "./services/huggingface";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

const askRequestSchema = z.object({
  question: z.string().min(1, "Question is required"),
});

const summarizeRequestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters long"),
});

const mcqRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  count: z.number().min(1).max(5).optional().default(3),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all messages (chat history)
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Ask a question
  app.post("/api/ask", async (req, res) => {
    try {
      const { question } = askRequestSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createMessage({
        type: "user",
        content: question,
        mode: "ask",
        metadata: null,
      });

      // Get AI response
      const aiResponse = await huggingFaceService.answerQuestion(question);
      
      // Save AI message
      const aiMessage = await storage.createMessage({
        type: "ai",
        content: aiResponse,
        mode: "ask",
        metadata: null,
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error processing question:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to process question" });
      }
    }
  });

  // Summarize text
  app.post("/api/summarize", async (req, res) => {
    try {
      const { text } = summarizeRequestSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createMessage({
        type: "user",
        content: text,
        mode: "summarize",
        metadata: null,
      });

      // Get AI summary
      const summaryPoints = await huggingFaceService.summarizeText(text);
      
      // Save AI message with summary metadata
      const aiMessage = await storage.createMessage({
        type: "ai",
        content: "Here's your summary:",
        mode: "summarize",
        metadata: { summaryPoints },
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error processing summary:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to process summary" });
      }
    }
  });

  // Generate MCQs
  app.post("/api/mcq", async (req, res) => {
    try {
      const { topic, count } = mcqRequestSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createMessage({
        type: "user",
        content: `Generate ${count} MCQs on ${topic}`,
        mode: "mcq",
        metadata: null,
      });

      // Get AI MCQs
      const mcqs = await huggingFaceService.generateMCQs(topic, count);
      
      // Save AI message with MCQ metadata
      const aiMessage = await storage.createMessage({
        type: "ai",
        content: `Here are ${mcqs.length} MCQs on ${topic}:`,
        mode: "mcq",
        metadata: { mcqs },
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error generating MCQs:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to generate MCQs" });
      }
    }
  });

  // Clear chat history
  app.delete("/api/messages", async (req, res) => {
    try {
      res.status(501).json({ message: "Clear history feature is not yet implemented" });
    } catch (error) {
      console.error("Error clearing messages:", error);
      res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
