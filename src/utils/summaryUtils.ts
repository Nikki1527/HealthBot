import { MedicalSummary } from '@/components/SummaryCard';
import { generateAIResponse } from '@/utils/groqApi';

// Fallback rule-based extractor in case AI API fails or throws errors
const generateMedicalSummaryFallback = (chatHistory: any[]): MedicalSummary => {
  const userMessages = chatHistory.filter(msg => msg.sender === 'user').map(msg => msg.content);
  const id = Math.random().toString(36).substring(2, 9);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const calculateSeverity = (messages: string[]): 'low' | 'medium' | 'high' => {
    const severeKeywords = ['severe', 'intense', 'unbearable', 'extreme', 'worst', 'emergency', 'critical'];
    const mediumKeywords = ['moderate', 'uncomfortable', 'painful', 'difficulty', 'problem'];
    const combinedText = messages.join(' ').toLowerCase();
    
    if (severeKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => combinedText.includes(keyword)) || messages.length > 3) {
      return 'medium';
    }
    return 'low';
  };
  
  const extractSymptoms = (messages: string[]): string[] => {
    const commonSymptoms = [
      'headache', 'fever', 'cough', 'sore throat', 'fatigue',
      'nausea', 'vomiting', 'dizziness', 'pain', 'rash',
      'breathing', 'chest pain', 'chills', 'sweating', 'runny nose',
      'congestion', 'sneezing', 'body ache', 'muscle pain', 'joint pain',
      'shortness of breath', 'weakness', 'loss of appetite', 'dehydration',
      'stomach ache', 'abdominal pain', 'diarrhea', 'constipation'
    ];
    
    const detectedSymptoms: string[] = [];
    const combinedText = messages.join(' ').toLowerCase();
    
    commonSymptoms.forEach(symptom => {
      if (combinedText.includes(symptom) && !detectedSymptoms.includes(symptom)) {
        detectedSymptoms.push(symptom);
      }
    });
    
    if (combinedText.includes('can\'t breathe') || combinedText.includes('trouble breathing')) {
      detectedSymptoms.push('difficulty breathing');
    }
    
    return detectedSymptoms.length > 0 ? detectedSymptoms : ['General consultation'];
  };
  
  const generateRecommendation = (symptoms: string[], severity: 'low' | 'medium' | 'high'): string => {
    const emergencySymptoms = ['chest pain', 'difficulty breathing', 'shortness of breath'];
    
    if (severity === 'high' || symptoms.some(s => emergencySymptoms.includes(s))) {
      return "URGENT: Your symptoms may require immediate medical attention. Please contact emergency services or visit the nearest emergency room.";
    }
    
    if (symptoms.includes('headache')) {
      return "Rest in a quiet, dark room. Stay hydrated and consider over-the-counter pain relief. Consult a healthcare provider if persistent.";
    } else if (symptoms.includes('fever')) {
      return "Rest, drink fluids, and monitor temperature. Use fever reducers. Seek medical attention if fever exceeds 103°F/39.4°C or persists past 3 days.";
    } else if (symptoms.includes('cough') || symptoms.includes('sore throat')) {
      return "Stay hydrated, use throat lozenges or saltwater gargles. If symptoms persist beyond a week, consult a healthcare provider.";
    }
    
    return "Monitor your symptoms and rest. Maintain hydration. If symptoms worsen, consult a healthcare provider.";
  };
  
  const extractedSymptoms = extractSymptoms(userMessages);
  const severity = calculateSeverity(userMessages);
  
  return {
    id,
    date: currentDate,
    title: `Medical Summary - ${currentDate}`,
    description: `Summary of symptoms: ${extractedSymptoms.join(', ')}. Analyzed locally via fallback parser.`,
    symptoms: extractedSymptoms,
    recommendation: generateRecommendation(extractedSymptoms, severity),
    severity,
    status: 'pending'
  };
};

// Main AI-powered dynamic summary generator
export const generateMedicalSummary = async (chatHistory: any[]): Promise<MedicalSummary> => {
  const userMessages = chatHistory.filter(msg => msg.sender === 'user');
  
  if (userMessages.length === 0) {
    return generateMedicalSummaryFallback(chatHistory);
  }

  // Format the conversation logs for the LLM
  const messagesText = chatHistory
    .map(msg => `${msg.sender === 'user' ? 'Patient' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const systemPrompt = `You are an expert clinical medical scribe. Analyze the conversation history between the patient and the assistant.
Generate a structured clinical summary report based ONLY on the reported symptoms in the conversation.
You MUST generate all content of the JSON text fields ("title", "description", "symptoms", and "recommendation") in English.
You MUST output ONLY a valid raw JSON object matching the JSON schema below, with no wrapping markdown code blocks (such as \`\`\`json), no extra text, and no explanations:

{
  "title": "A short, precise clinical title in English (e.g. 'Suspected Bronchitis', 'Migraine Headache', 'Acute Lumbago')",
  "description": "A detailed, clinical description of the symptoms, duration, and patient concern in English",
  "symptoms": ["list", "of", "symptoms", "extracted in English"],
  "recommendation": "Actionable home care advice and guidelines on when to seek professional care in English",
  "severity": "low" | "medium" | "high"
}

Guidance for Severity:
- "high": Signs of emergency (chest pain, shortness of breath, sudden severe weakness/numbness, high persistent fever).
- "medium": Symptoms that warrant doctor consultation (persistent pain, suspected infection, moderate injury).
- "low": Self-limiting minor issues (mild colds, minor muscle fatigue, occasional tension headaches).`;

  try {
    const responseText = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Here is the conversation history:\n\n${messagesText}` }
    ]);
    
    // Strip markdown formatting if any is returned by the LLM
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    
    const id = Math.random().toString(36).substring(2, 9);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      id,
      date: currentDate,
      title: parsed.title || `Medical Summary - ${currentDate}`,
      description: parsed.description || `Clinical report based on symptoms check.`,
      symptoms: Array.isArray(parsed.symptoms) && parsed.symptoms.length > 0 ? parsed.symptoms.map((s: string) => s.toLowerCase()) : ["general consultation"],
      recommendation: parsed.recommendation || "Rest, monitor symptoms, and drink fluids.",
      severity: ['low', 'medium', 'high'].includes(parsed.severity) ? parsed.severity : 'low',
      status: 'pending'
    };
  } catch (error) {
    console.error("AI summarization failed, falling back to rule-based summary:", error);
    return generateMedicalSummaryFallback(chatHistory);
  }
};
