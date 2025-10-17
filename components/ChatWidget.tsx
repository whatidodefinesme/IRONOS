import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { streamAiResponse } from '../services/geminiService';
import WidgetContainer from './WidgetContainer';
import { useSound } from '../hooks/useSound';
import { clickSound, messageSound } from '../assets/sounds';

// Fix: Add types for Web Speech API (SpeechRecognition) which are not standard in TypeScript
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const playClick = useSound(clickSound, 0.7);
  const playMessage = useSound(messageSound, 0.5);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    playClick();
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, playClick]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messages[messages.length - 1]?.text]);
  
  useEffect(() => {
    setMessages([{ id: 'initial-greeting', sender: 'ai', text: "Good day, Sir. All systems are operational. How may I assist you?"}])
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    playClick();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

    try {
      let isFirstChunk = true;
      for await (const chunk of streamAiResponse(userMessage.text)) {
        if (isFirstChunk) {
          playMessage();
          isFirstChunk = false;
        }
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, text: 'Apologies, Sir. I seem to be having trouble connecting to the network.' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const MicIcon: React.FC<{isListening: boolean}> = ({ isListening }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={`w-6 h-6 ${isListening ? 'text-red-500 animate-pulse' : 'text-cyan-300'}`}
    >
      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
      <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.75 6.75 0 1 1-13.5 0v-1.5a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );

  return (
    <WidgetContainer title="F.R.I.D.A.Y. COMMS" className="flex flex-col" padding="p-0">
      <div className="flex-grow overflow-y-auto p-4 pr-2 custom-scrollbar space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-white font-medium text-base transition-all duration-300 ${
                msg.sender === 'user' ? 'bg-sky-700/50' : 'bg-slate-700/50'
              }`}
            >
              {msg.text}
              {isLoading && msg.id === messages[messages.length - 1].id && <span className="inline-block w-2 h-4 bg-cyan-200 ml-1 animate-pulse"></span>}
            </div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-auto flex gap-2 p-4 border-t border-cyan-500/30 bg-black/20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 'Listening...' : "Enter command..."}
          aria-label="Chat input"
          className="flex-grow bg-black/30 border border-cyan-500/50 rounded-md px-3 py-2 text-cyan-200 placeholder-cyan-600/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          disabled={isLoading}
        />
        {recognitionRef.current && (
           <button
            type="button"
            onClick={toggleListening}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            className="bg-black/30 border border-cyan-500/50 text-slate-900 font-bold px-3 py-2 rounded-md hover:bg-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
           >
             <MicIcon isListening={isListening}/>
           </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className="bg-cyan-500/80 text-slate-900 font-bold px-4 py-2 rounded-md hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          SEND
        </button>
      </form>
    </WidgetContainer>
  );
};

export default memo(ChatWidget);