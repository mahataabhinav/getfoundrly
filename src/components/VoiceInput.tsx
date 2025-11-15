import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  multiline?: boolean;
}

export default function VoiceInput({
  value,
  onChange,
  placeholder = 'Type or hold microphone to speak...',
  className = '',
  rows = 1,
  multiline = false
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onChange(value + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [value, onChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const baseInputClasses = "w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]";

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${baseInputClasses} resize-none ${className}`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseInputClasses} ${className}`}
        />
      )}

      {isSupported && (
        <button
          type="button"
          onMouseDown={toggleListening}
          onMouseUp={toggleListening}
          onMouseLeave={() => {
            if (isListening) toggleListening();
          }}
          onTouchStart={toggleListening}
          onTouchEnd={toggleListening}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
            isListening
              ? 'bg-red-500 text-white scale-110 shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isListening ? 'Release to stop' : 'Hold to speak'}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
