import React, { useState, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { generateMedicalSummary } from '@/utils/summaryUtils';
import { speakText, stopSpeaking } from '@/utils/speechUtils';
import mockServer from '@/services/mockServer';
import { MedicalSummary } from '@/components/SummaryCard';

const Chat = () => {
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<MedicalSummary | null>(null);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const chatInterfaceRef = useRef<{ getMessages?: () => any[] } | null>(null);
  
  const handleGetSummary = async () => {
    const messages = chatInterfaceRef.current?.getMessages?.() || [];
    
    if (messages.length <= 1) {
      toast({
        title: "Not enough information",
        description: "Please have a conversation about your symptoms first.",
        variant: "destructive"
      });
      return;
    }
    
    const summary = await generateMedicalSummary(messages);
    
    try {
      toast({
        title: "Processing Summary",
        description: "Generating your medical summary, please wait...",
      });
      
      const savedSummary = await mockServer.saveSummary(summary);
      setGeneratedSummary(savedSummary);
      setShowSummary(true);
      
      toast({
        title: "Medical Summary Generated",
        description: "Your symptoms have been analyzed and a summary has been created.",
        action: (
          <Link to="/dashboard">
            <Button size="sm" variant="outline">
              View All
            </Button>
          </Link>
        ),
      });
      
      // Auto-save the report to local history
      await handleSaveSummary(savedSummary);
      
    } catch (error) {
      toast({
        title: "Error Generating Summary",
        description: "There was an error generating your medical summary. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveSummary = async (summaryToSave = generatedSummary) => {
    if (!summaryToSave) return;
    
    toast({
      title: "Saving Report",
      description: "Adding medical report to your local history...",
    });
    
    try {
      const savedSummary = await mockServer.saveSummaryToHistory(summaryToSave.id);
      setGeneratedSummary(savedSummary);
      
      toast({
        title: "Report Saved Successfully",
        description: "Your medical report has been securely saved to your local history.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Saving Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  const toggleSpeech = async () => {
    if (isSpeakingState) {
      stopSpeaking();
      setIsSpeakingState(false);
    } else if (generatedSummary) {
      setIsSpeakingState(true);
      const textToSpeak = `AI Symptom Checker: ${generatedSummary.title}. ${generatedSummary.description}. ${generatedSummary.recommendation}`;
      
      try {
        await speakText(textToSpeak);
        setIsSpeakingState(false);
      } catch (error) {
        console.error("Speech error:", error);
        setIsSpeakingState(false);
        toast({
          title: "Speech Error",
          description: "There was an error with text-to-speech. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-4 pl-0 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-transparent">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </Button>

          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-medical-dark dark:text-white mb-2">AI Symptom Checker</h1>
              <p className="text-slate-600 dark:text-slate-300">
                Describe your symptoms in a natural conversation with our AI health assistant powered by Groq. Get instant insights and treatment suggestions.
              </p>
            </div>
          </div>
          
          <ChatInterface ref={chatInterfaceRef} />
          
          <div className="mt-6 flex justify-end items-center">
            <Button 
              onClick={handleGetSummary}
              className="gap-2 bg-medical-accent hover:bg-medical-accent/90 text-white font-medium"
            >
              <CheckCircle className="h-4 w-4" />
              Generate Medical Summary
            </Button>
          </div>
        </div>
      </main>
      
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-medical-accent" />
              AI Symptom Checker
            </DialogTitle>
            <DialogDescription>
              A summary of your reported symptoms and recommended actions
            </DialogDescription>
          </DialogHeader>
          
          {generatedSummary && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Reported Symptoms:</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedSummary.symptoms.map((symptom, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Recommendation:</h3>
                <p className="text-sm border-l-2 border-medical-primary pl-3 py-1 dark:text-slate-200">
                  {generatedSummary.recommendation}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <Button 
                  onClick={toggleSpeech} 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                >
                  {isSpeakingState ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {isSpeakingState ? 'Stop Voice' : 'Read Aloud'}
                </Button>
                
                {generatedSummary.status === 'pending' ? (
                  <Button 
                    onClick={() => handleSaveSummary()} 
                    className="gap-1 bg-medical-primary hover:bg-medical-primary/90 text-white"
                    size="sm"
                  >
                    Save to History
                  </Button>
                ) : (
                  <Link to="/dashboard">
                    <Button size="sm" variant="outline" className="gap-1">
                      View in Dashboard
                    </Button>
                  </Link>
                )}
              </div>
              
              {generatedSummary.status === 'saved' && generatedSummary.savedAt && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <p>Saved locally on: {new Date(generatedSummary.savedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Chat;
