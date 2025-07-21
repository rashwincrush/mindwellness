// AI Analysis utilities for client-side processing
export interface MoodAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keywords: string[];
  concerns: string[];
  recommendations: string[];
}

export interface ChatResponse {
  message: string;
  suggestions: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'exercise' | 'contact';
  }>;
}

class AIService {
  async analyzeMood(journalEntry: string, mood: string, energyLevel: number): Promise<MoodAnalysis> {
    try {
      const response = await fetch('/api/ai/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalEntry,
          mood,
          energyLevel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze mood');
      }

      return await response.json();
    } catch (error) {
      console.error('Mood analysis error:', error);
      // Return fallback analysis
      return {
        sentiment: mood === 'very-sad' || mood === 'sad' ? 'negative' : 
                  mood === 'okay' ? 'neutral' : 'positive',
        confidence: 0.5,
        keywords: [],
        concerns: [],
        recommendations: ['Consider speaking with a counselor', 'Practice mindfulness exercises']
      };
    }
  }

  async chatWithAI(message: string, context?: any[]): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context
        })
      });

      if (!response.ok) {
        throw new Error('AI chat failed');
      }

      return await response.json();
    } catch (error) {
      console.error('AI chat error:', error);
      // Return fallback response
      return {
        message: "I understand you're reaching out. While I'm having trouble connecting right now, please know that your feelings are valid. If this is urgent, please contact a counselor or call the crisis hotline at 988.",
        suggestions: [
          "Tell me more about how you're feeling",
          "What happened today that's bothering you?",
          "Would you like some breathing exercises?"
        ],
        resources: [
          {
            title: "Crisis Text Line",
            url: "sms:741741",
            type: "contact"
          },
          {
            title: "5-Minute Breathing Exercise",
            url: "#breathing-exercise",
            type: "exercise"
          }
        ]
      };
    }
  }

  async getWellnessInsights(userId: string): Promise<{
    trends: Array<{
      period: string;
      averageMood: number;
      moodTrend: 'improving' | 'stable' | 'concerning';
    }>;
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`/api/ai/wellness-insights/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get wellness insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Wellness insights error:', error);
      return {
        trends: [],
        recommendations: ['Continue regular check-ins', 'Maintain healthy routines']
      };
    }
  }
}

export const aiService = new AIService();
