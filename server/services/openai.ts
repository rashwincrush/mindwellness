import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "demo-key"
});

// If no real API key is present, operate in mock mode (skip external calls)
const hasApiKey = !!(process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY);

if (!hasApiKey) {
  // eslint-disable-next-line no-console
  console.warn("OpenAI API key not set. Running in MOCK AI mode (no external API calls).");
}

interface MoodAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keywords: string[];
  concerns: string[];
  recommendations: string[];
  flagged: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface ChatResponse {
  message: string;
  suggestions: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'exercise' | 'contact';
  }>;
}

class OpenAIService {
  async analyzeMoodEntry(
    journalEntry: string, 
    mood: string, 
    energyLevel: number
  ): Promise<MoodAnalysis> {
    try {
      // Short-circuit with local heuristic analysis if no API key is configured
      if (!hasApiKey) {
        const isLowMood = mood === 'very-sad' || mood === 'sad';
        const isLowEnergy = energyLevel <= 2;
        const lower = journalEntry?.toLowerCase() || '';
        const hasConcerningKeywords = lower.includes('hurt') || lower.includes('alone') || lower.includes('hopeless');

        return {
          sentiment: isLowMood ? 'negative' : mood === 'okay' ? 'neutral' : 'positive',
          confidence: 0.6,
          keywords: [],
          concerns: hasConcerningKeywords ? ['concerning language detected'] : [],
          recommendations: isLowMood ? ['Consider speaking with a counselor', 'Practice self-care'] : ['Keep up the positive attitude'],
          flagged: isLowMood && (isLowEnergy || hasConcerningKeywords),
          priority: isLowMood && hasConcerningKeywords ? 'high' : 'medium'
        };
      }

      const prompt = `You are a mental health expert analyzing a student's mood check-in. 
      
      Student mood: ${mood}
      Energy level: ${energyLevel}/5
      Journal entry: "${journalEntry}"
      
      Analyze this entry for:
      1. Overall sentiment (positive/neutral/negative)
      2. Confidence level (0-1)
      3. Key emotional keywords
      4. Any concerns or red flags
      5. Helpful recommendations
      6. Whether this should be flagged for counselor attention
      7. Priority level if flagged
      
      Respond with JSON in this exact format:
      {
        "sentiment": "positive|neutral|negative",
        "confidence": 0.85,
        "keywords": ["stressed", "worried"],
        "concerns": ["mention of isolation", "academic pressure"],
        "recommendations": ["breathing exercises", "talk to counselor"],
        "flagged": true,
        "priority": "medium"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a compassionate mental health expert specializing in adolescent psychology and school wellness programs."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        sentiment: result.sentiment || 'neutral',
        confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
        keywords: Array.isArray(result.keywords) ? result.keywords : [],
        concerns: Array.isArray(result.concerns) ? result.concerns : [],
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
        flagged: Boolean(result.flagged),
        priority: result.priority || 'medium'
      };
      
    } catch (error) {
      console.error("AI mood analysis error:", error);
      
      // Fallback analysis based on mood and energy level
      const isLowMood = mood === 'very-sad' || mood === 'sad';
      const isLowEnergy = energyLevel <= 2;
      const hasConcerningKeywords = journalEntry?.toLowerCase().includes('hurt') || 
                                   journalEntry?.toLowerCase().includes('alone') ||
                                   journalEntry?.toLowerCase().includes('hopeless');
      
      return {
        sentiment: isLowMood ? 'negative' : mood === 'okay' ? 'neutral' : 'positive',
        confidence: 0.6,
        keywords: [],
        concerns: hasConcerningKeywords ? ['concerning language detected'] : [],
        recommendations: isLowMood ? ['Consider speaking with a counselor', 'Practice self-care'] : ['Keep up the positive attitude'],
        flagged: isLowMood && (isLowEnergy || hasConcerningKeywords),
        priority: isLowMood && hasConcerningKeywords ? 'high' : 'medium'
      };
    }
  }

  async chatWithStudent(message: string, context: any[] = []): Promise<ChatResponse> {
    try {
      // Return a safe, supportive mock response if no API key is configured
      if (!hasApiKey) {
        const suggestions = this.generateSuggestions(message, "");
        const resources = this.generateResources(message);
        return {
          message: "Thanks for sharing. I'm here to listen and support you. Would you like to talk more about what's on your mind today?",
          suggestions,
          resources
        };
      }

      const systemPrompt = `You are a compassionate AI wellness companion for students. Your role is to:
      - Provide supportive, non-judgmental responses
      - Encourage healthy coping strategies
      - Recognize when professional help is needed
      - Never provide medical advice or therapy
      - Always prioritize student safety
      - Suggest appropriate resources when helpful
      
      If a student mentions self-harm, suicidal thoughts, or immediate danger, always recommend contacting:
      - Crisis Text Line: Text HOME to 741741
      - National Suicide Prevention Lifeline: 988
      - Emergency services: 911
      - School counselor
      
      Keep responses warm, age-appropriate, and hopeful.`;

      const contextMessages: { role: 'assistant' | 'user'; content: string }[] = context
        .slice(-4)
        .map((msg: any) => ({
          role: msg?.isAi ? 'assistant' : 'user',
          content: String(msg?.message ?? '')
        }));

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          ...contextMessages,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const aiMessage = response.choices[0].message.content || "";
      
      // Generate contextual suggestions and resources
      const suggestions = this.generateSuggestions(message, aiMessage);
      const resources = this.generateResources(message);

      return {
        message: aiMessage,
        suggestions,
        resources
      };
      
    } catch (error) {
      console.error("AI chat error:", error);
      throw error;
    }
  }

  private generateSuggestions(userMessage: string, aiResponse: string): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry')) {
      return [
        "Can you tell me what's making you anxious?",
        "Would you like to try a breathing exercise?",
        "What usually helps when you feel this way?"
      ];
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
      return [
        "I'm here to listen. What's been going on?",
        "Would talking to someone help?",
        "What's one small thing that might make you feel better?"
      ];
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) {
      return [
        "What's causing the most stress right now?",
        "Can we break this down into smaller parts?",
        "What support do you have available?"
      ];
    }
    
    return [
      "Tell me more about that",
      "How are you feeling about everything?",
      "What would be most helpful right now?"
    ];
  }

  private generateResources(message: string): ChatResponse['resources'] {
    const lowerMessage = message.toLowerCase();
    const resources: ChatResponse['resources'] = [];
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('panic')) {
      resources.push({
        title: "Anxiety Relief Breathing Exercise",
        url: "#breathing-exercise",
        type: "exercise"
      });
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      resources.push({
        title: "Better Sleep Guide for Students",
        url: "#sleep-guide",
        type: "article"
      });
    }
    
    if (lowerMessage.includes('friend') || lowerMessage.includes('social')) {
      resources.push({
        title: "Building Healthy Relationships",
        url: "#social-skills",
        type: "article"
      });
    }
    
    // Always include crisis resources for serious situations
    if (lowerMessage.includes('hurt') || lowerMessage.includes('harm') || 
        lowerMessage.includes('end') || lowerMessage.includes('hopeless')) {
      resources.push(
        {
          title: "Crisis Text Line",
          url: "sms:741741",
          type: "contact"
        },
        {
          title: "National Suicide Prevention Lifeline",
          url: "tel:988",
          type: "contact"
        }
      );
    }
    
    return resources;
  }

  async getWellnessInsights(userId: string): Promise<{
    trends: Array<{
      period: string;
      averageMood: number;
      moodTrend: 'improving' | 'stable' | 'concerning';
    }>;
    recommendations: string[];
  }> {
    // This would typically analyze historical data
    // For now, returning mock insights
    return {
      trends: [
        {
          period: "This week",
          averageMood: 3.8,
          moodTrend: 'stable'
        }
      ],
      recommendations: [
        "Continue regular check-ins",
        "Maintain healthy routines",
        "Consider joining a peer support group"
      ]
    };
  }
}

export const openaiService = new OpenAIService();
