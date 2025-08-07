import { GoogleGenerativeAI } from '@google/generative-ai';
import { createCulturalStoryPrompt, createDecisionPrompt } from '../utils/culturalPrompts';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('API Key de Gemini no configurada para Mictlán Sonoro');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateCulturalStory = async (formData) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
    
    const prompt = createCulturalStoryPrompt(formData);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generando cuento cultural:', error);
    throw new Error('No se pudo generar el cuento. Verifica tu conexión y API key.');
  }
};

export const continueStoryWithDecision = async (storyContext, decision, selectedOption) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = createDecisionPrompt(storyContext, decision, selectedOption);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error continuando historia:', error);
    throw new Error('No se pudo continuar la historia.');
  }
};