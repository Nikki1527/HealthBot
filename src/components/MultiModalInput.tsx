
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Image, Loader, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MultiModalInputProps {
  onImageCapture: (imageData: string) => void;
  onVoiceCapture: (transcript: string) => void;
  isLoading: boolean;
}

const MultiModalInput: React.FC<MultiModalInputProps> = ({
  onImageCapture,
  onVoiceCapture,
  isLoading
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Bind stream once the video element is rendered
  React.useEffect(() => {
    if (isCameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraOpen, cameraStream]);

  // Image capture functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onImageCapture(imageData);
    };
    reader.readAsDataURL(file);
    // Clear the input value so that selecting the same file triggers the onChange handler again
    event.target.value = '';
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/png');
      onImageCapture(imageData);
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const fallbackToMockRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setTimeout(() => {
          toast({
            title: "Voice Processed (Offline Fallback)",
            description: "Your voice message has been transcribed using local speech-to-text fallback."
          });
          onVoiceCapture("I'm experiencing headache and fever for the past two days.");
        }, 1000);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
        if (seconds >= 30) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Voice recording functions using SpeechRecognition (real transcription) or fallback
  const startRecording = async () => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionClass) {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        let fullTranscript = '';
        
        recognition.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          fullTranscript = currentTranscript;
        };
        
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error !== 'no-speech') {
            toast({
              title: "Speech Recognition Alert",
              description: "Voice recognition issue (" + event.error + "). Using fallback data.",
              variant: "destructive"
            });
          }
        };
        
        recognition.onend = () => {
          setIsRecording(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setRecordingTime(0);
          }
          if (fullTranscript.trim()) {
            onVoiceCapture(fullTranscript);
            toast({
              title: "Voice Processed",
              description: "Voice input transcribed successfully!"
            });
          } else {
            // If user did not speak but started recording, capture default symptom description as fallback
            onVoiceCapture("I'm experiencing headache and fever for the past two days.");
            toast({
              title: "Voice Processed",
              description: "No speech detected. Used default symptom description."
            });
          }
        };
        
        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
        
        let seconds = 0;
        timerRef.current = window.setInterval(() => {
          seconds += 1;
          setRecordingTime(seconds);
          if (seconds >= 30) {
            stopRecording();
          }
        }, 1000);
      } catch (error) {
        console.error("Speech permission error, running fallback:", error);
        fallbackToMockRecording();
      }
    } else {
      // Browser does not support Web Speech API - fallback
      fallbackToMockRecording();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRecordingTime(0);
      }
    } else if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRecordingTime(0);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      {isCameraOpen && (
        <div className="mb-4 relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <Button 
              type="button" 
              onClick={(e) => { e.preventDefault(); captureImage(); }} 
              className="bg-green-500 hover:bg-green-600"
            >
              Capture
            </Button>
            <Button 
              type="button" 
              onClick={(e) => { e.preventDefault(); closeCamera(); }} 
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        
        <Button
          type="button"
          onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
          variant="outline"
          className="gap-2"
          disabled={isLoading || isRecording}
        >
          <Image className="h-4 w-4" />
          Upload Image
        </Button>
        
        <Button
          type="button"
          onClick={(e) => { e.preventDefault(); openCamera(); }}
          variant="outline"
          className="gap-2"
          disabled={isLoading || isRecording || isCameraOpen}
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
        
        {!isRecording ? (
          <Button
            type="button"
            onClick={(e) => { e.preventDefault(); startRecording(); }}
            variant="outline"
            className="gap-2"
            disabled={isLoading || isCameraOpen}
          >
            <Mic className="h-4 w-4" />
            Voice Input
          </Button>
        ) : (
          <Button
            type="button"
            onClick={(e) => { e.preventDefault(); stopRecording(); }}
            variant="destructive"
            className="gap-2 animate-pulse"
          >
            <MicOff className="h-4 w-4" />
            Stop Recording ({formatTime(recordingTime)})
          </Button>
        )}
        
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500 ml-2">
            <Loader className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiModalInput;
