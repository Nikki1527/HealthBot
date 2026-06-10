
export const speakText = (text: string, lang = 'en-US'): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.lang = lang;
      utterance.volume = 1; // 0 to 1
      utterance.rate = 1; // 0.1 to 10
      utterance.pitch = 1; // 0 to 2
      
      // Set up event handlers
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // Try to find preferred voices for the selected language
      const voices = window.speechSynthesis.getVoices();
      
      // Normalize language code (e.g., 'te-IN' -> 'te')
      const langCode = lang.split('-')[0].toLowerCase();
      
      const preferredVoice = voices.find(voice => {
        const voiceLang = voice.lang.toLowerCase();
        return voiceLang === lang.toLowerCase() || voiceLang.startsWith(langCode);
      });
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      } else {
        // Fallback search
        const fallbackVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Samantha') || 
          voice.name.includes('Microsoft') ||
          (voice.name.includes('Female') && voice.lang.startsWith('en-'))
        );
        if (fallbackVoice && langCode === 'en') {
          utterance.voice = fallbackVoice;
        }
      }
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      reject(new Error('Speech synthesis not supported in this browser'));
    }
  });
};

// Function to stop speaking
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// Get available voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};

// Check if browser is currently speaking
export const isSpeaking = (): boolean => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
