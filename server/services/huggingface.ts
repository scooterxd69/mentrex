interface HuggingFaceResponse {
  generated_text?: string;
  summary_text?: string;
  error?: string;
}

interface MCQOption {
  option: string;
  text: string;
}

interface MCQ {
  question: string;
  options: MCQOption[];
  correctAnswer: string;
}

export class HuggingFaceService {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor() {
    this.apiKey = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY || '';
    if (!this.apiKey) {
      console.warn('No Hugging Face API key found. Set HUGGING_FACE_API_KEY or HF_API_KEY environment variable.');
    }
  }

  private async makeRequest(modelId: string, inputs: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async answerQuestion(question: string): Promise<string> {
    try {
      const prompt = `Answer this question in simple terms suitable for high school students. Be direct and clear.

Question: ${question}

Answer:`;

      const result = await this.makeRequest('google/flan-t5-base', prompt);
      
      if (Array.isArray(result) && result[0]?.generated_text) {
        let answer = result[0].generated_text.replace(prompt, '').trim();
        return this.formatAnswer(answer);
      }
      
      throw new Error('Invalid response from AI model');
    } catch (error) {
      console.error('Error answering question:', error);
      return "I'm having trouble connecting to the AI service right now. Please try again later!";
    }
  }

  async summarizeText(text: string): Promise<string[]> {
    try {
      const prompt = `Summarize the following text into exactly 5 key bullet points. Each point should be clear and concise for high school students.

Text: ${text}

Summary points:`;

      const result = await this.makeRequest('facebook/bart-large-cnn', {
        inputs: text,
        parameters: {
          max_length: 200,
          min_length: 50,
          do_sample: false
        }
      });

      if (Array.isArray(result) && result[0]?.summary_text) {
        return this.formatSummary(result[0].summary_text);
      }

      // Fallback to text generation if summarization fails
      const fallbackResult = await this.makeRequest('google/flan-t5-base', prompt);
      if (Array.isArray(fallbackResult) && fallbackResult[0]?.generated_text) {
        return this.formatSummary(fallbackResult[0].generated_text);
      }
      
      throw new Error('Invalid response from AI model');
    } catch (error) {
      console.error('Error summarizing text:', error);
      return [
        "I'm having trouble summarizing this content right now.",
        "Please try again later or break down your text into smaller sections.",
        "In the meantime, try highlighting the main ideas yourself!",
        "Remember: look for topic sentences and key concepts.",
        "You've got this! 💪"
      ];
    }
  }

  async generateMCQs(topic: string, count: number = 3): Promise<MCQ[]> {
    try {
      const prompt = `Generate ${count} multiple choice questions about ${topic} for high school students. Format each as:

Q1. [Question]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]
Answer: [Correct option letter]

Topic: ${topic}`;

      const result = await this.makeRequest('google/flan-t5-base', prompt);
      
      if (Array.isArray(result) && result[0]?.generated_text) {
        return this.formatMCQs(result[0].generated_text);
      }
      
      throw new Error('Invalid response from AI model');
    } catch (error) {
      console.error('Error generating MCQs:', error);
      return this.getFallbackMCQs(topic);
    }
  }

  private formatAnswer(answer: string): string {
    // Clean up and format the answer
    answer = answer.replace(/^Answer:\s*/i, '').trim();
    
    // Add encouraging tone if it's too dry
    if (answer.length > 0 && !answer.includes('!') && !answer.includes('?')) {
      answer += ' Hope this helps! 😊';
    }
    
    return answer;
  }

  private formatSummary(summaryText: string): string[] {
    // Try to extract bullet points or create them
    const lines = summaryText.split(/[.\n]/).filter(line => line.trim().length > 0);
    
    if (lines.length >= 3) {
      return lines.slice(0, 5).map((line, index) => 
        line.trim().replace(/^\d+\.?\s*/, '').replace(/^-\s*/, '')
      );
    }
    
    // If we can't parse properly, create a basic summary
    return [
      "Main concept: " + summaryText.slice(0, 100) + "...",
      "Key details are included in the original text",
      "Focus on understanding the core ideas first",
      "Break it down into smaller parts for better learning",
      "You're doing great - keep studying! 🌟"
    ];
  }

  private formatMCQs(mcqText: string): MCQ[] {
    // This is a simplified parser - in production, you'd want more robust parsing
    const mcqs: MCQ[] = [];
    const questions = mcqText.split(/Q\d+\./).filter(q => q.trim());
    
    questions.slice(0, 3).forEach((questionBlock, index) => {
      const lines = questionBlock.trim().split('\n').filter(line => line.trim());
      if (lines.length >= 5) {
        const question = lines[0].trim();
        const options = lines.slice(1, 5).map(line => {
          const match = line.match(/^([A-D])\)\s*(.+)$/);
          return match ? { option: match[1], text: match[2] } : { option: 'A', text: line };
        });
        
        const answerLine = lines.find(line => line.startsWith('Answer:'));
        const correctAnswer = answerLine ? answerLine.replace('Answer:', '').trim() : 'A';
        
        mcqs.push({
          question,
          options,
          correctAnswer
        });
      }
    });
    
    return mcqs.length > 0 ? mcqs : this.getFallbackMCQs("general knowledge");
  }

  private getFallbackMCQs(topic: string): MCQ[] {
    return [
      {
        question: `What is an important concept related to ${topic}?`,
        options: [
          { option: 'A', text: 'Understanding the basic principles' },
          { option: 'B', text: 'Memorizing all details without understanding' },
          { option: 'C', text: 'Skipping the fundamentals' },
          { option: 'D', text: 'Avoiding practice questions' }
        ],
        correctAnswer: 'A'
      },
      {
        question: `How should you approach studying ${topic}?`,
        options: [
          { option: 'A', text: 'Rush through everything quickly' },
          { option: 'B', text: 'Take your time and understand each concept' },
          { option: 'C', text: 'Only read without practicing' },
          { option: 'D', text: 'Skip difficult parts' }
        ],
        correctAnswer: 'B'
      },
      {
        question: `What\'s the best way to remember ${topic} concepts?`,
        options: [
          { option: 'A', text: 'Passive reading only' },
          { option: 'B', text: 'Active practice and application' },
          { option: 'C', text: 'Cramming before exams' },
          { option: 'D', text: 'Avoiding review sessions' }
        ],
        correctAnswer: 'B'
      }
    ];
  }
}

export const huggingFaceService = new HuggingFaceService();
