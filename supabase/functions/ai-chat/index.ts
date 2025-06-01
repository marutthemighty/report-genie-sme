
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Remove old requests outside the time window
  const recentRequests = userRequests.filter((time: number) => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Chat function called');
    
    if (!geminiApiKey) {
      console.error('Google Gemini API key not found');
      throw new Error('Google Gemini API key not configured');
    }

    const requestBody = await req.json();
    const { message, context } = requestBody;
    
    if (!message) {
      throw new Error('Message is required');
    }
    
    console.log('Received message:', message);

    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait before sending another message.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced prompt for better AI responses
    const enhancedPrompt = `You are ReportAI Assistant, an expert AI specializing in data analytics, business intelligence, and reporting for SaaS applications. 

Your expertise includes:
- Data analysis and visualization
- Business metrics interpretation
- Report generation and insights
- E-commerce analytics
- Customer behavior analysis
- Performance optimization recommendations

Context: You're helping users with their analytics dashboard and reports in a professional SaaS environment.

${context ? `Additional context: ${context}` : ''}

User message: ${message}

Please provide a helpful, accurate, and actionable response. If the user asks about data analysis, provide specific insights and recommendations. If they need technical help, be clear and detailed. Always maintain a professional yet friendly tone.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            stopSequences: []
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error response:', errorData);
      
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again in a few moments.');
      } else if (response.status === 400) {
        throw new Error('Invalid request to AI service. Please try rephrasing your message.');
      } else if (response.status === 403) {
        throw new Error('AI service access denied. Please check API configuration.');
      } else {
        throw new Error(`AI service error: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      throw new Error('AI service returned no response. Please try again.');
    }

    const candidate = data.candidates[0];
    
    if (candidate.finishReason === 'SAFETY') {
      throw new Error('Message was blocked for safety reasons. Please rephrase your question.');
    }
    
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('No content in candidate:', candidate);
      throw new Error('AI service returned an incomplete response. Please try again.');
    }

    const aiResponse = candidate.content.parts[0].text || 'I apologize, but I could not generate a response. Please try again.';

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usageMetadata || null 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    
    const errorMessage = error.message || 'An unexpected error occurred';
    const statusCode = error.message?.includes('rate limit') ? 429 : 
                      error.message?.includes('API') ? 502 : 500;
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
