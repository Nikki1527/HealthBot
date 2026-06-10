import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import MultiModalInput from './MultiModalInput';
import { Send, Loader, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAIResponse, getMedicalSystemPrompt, GroqMessage } from '@/utils/groqApi';

type Message = {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  messageType?: 'text' | 'image';
  imageData?: string;
};

const ChatInterface = forwardRef(function ChatInterface(props, ref) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        content: "Hi, I'm your HealthScribe assistant. Describe your symptoms (in detail, or use Voice/Photo uploads) and I will generate a clinical-grade diagnostic summary for you.",
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    getMessages: () => messages
  }));

  const processMessageWithGroqAPI = async (userMessage: string, imageData?: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      const systemPrompt = getMedicalSystemPrompt();
      const groqMessages: GroqMessage[] = [
        { role: 'system', content: systemPrompt },
      ];
      
      const conversationHistory = messages.slice(-10);
      conversationHistory.forEach(msg => {
        groqMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
      
      let currentMessage = userMessage;
      if (imageData) {
        currentMessage += " [Note: User has uploaded an image of their condition for review.]";
      }
      
      groqMessages.push({ role: 'user', content: currentMessage });
      
      const response = await generateAIResponse(groqMessages);
      
      const commonSymptoms = [
        'headache', 'fever', 'cough', 'sore throat', 'fatigue', 
        'nausea', 'vomiting', 'dizziness', 'pain', 'rash',
        'breathing', 'chest pain', 'chills', 'sweating'
      ];
      
      const newSymptoms = commonSymptoms.filter(symptom => 
        userMessage.toLowerCase().includes(symptom) && 
        !detectedSymptoms.includes(symptom)
      );
      
      if (newSymptoms.length > 0) {
        setDetectedSymptoms(prev => [...prev, ...newSymptoms]);
      }
      
      return response;
    } catch (error) {
      console.error("Error processing with Groq API:", error);
      return "I'm having trouble processing your request right now. Could you try again in a moment?";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !showImagePreview) return;
    
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date(),
      messageType: showImagePreview ? 'image' : 'text',
      imageData: showImagePreview || undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowImagePreview(null);
    
    const aiResponse = await processMessageWithGroqAPI(input, userMessage.imageData);
    
    const aiMessage: Message = {
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageCapture = (imageData: string) => {
    setShowImagePreview(imageData);
    toast({
      title: "Image Uploaded",
      description: "Ready to review. Add detail or send directly.",
    });
  };

  const handleVoiceCapture = (transcript: string) => {
    setInput(transcript);
    toast({
      title: "Voice Transcribed",
      description: "Press Send to submit your description.",
    });
  };

  const clearImagePreview = () => {
    setShowImagePreview(null);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="glass-card rounded-2xl h-[620px] flex flex-col border border-white/60 dark:border-slate-800/80 shadow-xl overflow-hidden">
      {/* Header info */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">AI Scribe Consultation</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-medical-primary bg-sky-50 dark:bg-sky-950/30 px-2.5 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/30">
          <Sparkles className="h-3 w-3 fill-current" /> Llama-3.1 Active
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <CardContent className="pt-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              messageType={message.messageType}
              imageData={message.imageData}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-pulse">
              <div className="flex items-center space-x-2.5 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <Loader className="h-4 w-4 text-medical-primary animate-spin" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Formulating diagnostic opinion...</span>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        {showImagePreview && (
          <div className="mb-3 relative inline-block">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
              <img src={showImagePreview} alt="Preview" className="h-[100px] object-cover" />
              <button
                onClick={clearImagePreview}
                className="absolute top-1 right-1 h-5 w-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-sm transition-colors"
              >
                &times;
              </button>
            </div>
          </div>
        )}
        
        <MultiModalInput 
          onImageCapture={handleImageCapture}
          onVoiceCapture={handleVoiceCapture}
          isLoading={isLoading}
        />
        
        <div className="flex space-x-2 mt-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms (e.g. onset, pain levels, triggers)..."
            className="flex-1 h-11 border-slate-200 dark:border-slate-800 focus-visible:ring-medical-primary rounded-xl dark:bg-slate-900 dark:text-white"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={(!input.trim() && !showImagePreview) || isLoading}
            className="bg-gradient-to-tr from-medical-primary to-sky-500 hover:from-medical-primary/95 hover:to-sky-500/95 text-white h-11 w-11 rounded-xl shadow-md shadow-sky-500/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
});

export default ChatInterface;
