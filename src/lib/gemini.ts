import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize Gemini API client
 * Reads API key from environment variable VITE_GEMINI_API_KEY
 */
function getGeminiClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.\n' +
        'Get your API key from: https://ai.google.dev/'
    );
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Call Gemini API with a text prompt
 * @param prompt - The text prompt to send to Gemini
 * @returns The generated text response
 */
export async function callGemini(prompt: string): Promise<string> {
  try {
    const genAI = getGeminiClient();

    // Use Gemini 1.5 Flash for fast responses
    // You can change this to 'gemini-1.5-pro' for higher quality responses
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);

    // Provide helpful error messages
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key. Please check your .env file.');
    } else if (error.message?.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please check your usage limits.');
    } else if (error.message?.includes('SAFETY')) {
      throw new Error('Content was blocked by safety filters. Try a different prompt.');
    } else {
      throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
    }
  }
}

/**
 * Validate that the Gemini API key is configured
 * @returns true if API key is set, false otherwise
 */
export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}
