import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, User, Activity } from 'lucide-react';

type ChatMessageProps = {
  content: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
  messageType?: 'text' | 'image';
  imageData?: string;
};

const ChatMessage = ({ content, sender, timestamp, messageType, imageData }: ChatMessageProps) => {
  const isAi = sender === 'ai';
  
  return (
    <div className={cn(
      "flex w-full mb-5 animate-fade-in",
      isAi ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "flex items-start max-w-[85%] md:max-w-[75%]",
        isAi ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "flex-shrink-0 mt-1",
          isAi ? "mr-3" : "ml-3"
        )}>
          {isAi ? (
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-medical-primary to-emerald-400 text-white shadow-md shadow-sky-500/25">
              <Heart className="h-4.5 w-4.5 fill-current" />
            </div>
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <User className="h-4.5 w-4.5" />
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-4 rounded-2xl shadow-sm",
          isAi 
            ? "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 rounded-tl-sm" 
            : "bg-gradient-to-tr from-medical-primary to-sky-500 text-white rounded-tr-sm shadow-md shadow-sky-500/10"
        )}>
          {messageType === 'image' && imageData && (
            <div className="mb-3 rounded-lg overflow-hidden border border-slate-200/50 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <img 
                src={imageData} 
                alt="User uploaded" 
                className="max-w-full max-h-[250px] object-contain mx-auto" 
              />
            </div>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          {timestamp && (
            <p className={cn(
              "text-[10px] mt-2 font-medium uppercase tracking-wider text-right",
              isAi ? "text-slate-400" : "text-sky-100"
            )}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
