"use client";

import React, { useState, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { API_URL } from "@/lib/config";

export const Translation = memo(function Translation() {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationData, setTranslationData] = useState<{originalText: string, translatedText: string, detectedLanguage: string, confidence?: string} | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      {/* Ambient glow for microphone card */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="font-bold tracking-tight text-white flex items-center">
          <Mic size={18} className="mr-2 text-cyan-400" /> Auto-Translate
        </h3>
        <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30">Active</span>
      </div>
      
      <div className="glass-panel rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center text-center relative z-10 group min-h-[200px]">
        
        {isListening ? (
            <div aria-live="polite" className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="flex space-x-1 mb-6">
                {[1,2,3,4,5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-cyan-400 rounded-full"
                    animate={{ height: ["10px", "30px", "10px"] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <p className="text-sm text-cyan-400 font-medium animate-pulse mb-3">Listening to microphone...</p>
              <button 
                onClick={() => {
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                }}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full text-xs font-bold transition-colors border border-red-500/30"
              >
                <Square size={12} fill="currentColor" />
                <span>Stop</span>
              </button>
            </div>
        ) : isTranslating ? (
          <div aria-live="polite" className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <p className="text-sm text-cyan-400 font-medium animate-pulse">Translating with Vertex AI...</p>
          </div>
        ) : translationData ? (
          <div aria-live="polite" className="flex flex-col items-center justify-center w-full animate-in fade-in duration-500">
            <div className="flex space-x-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">{translationData.detectedLanguage}</span>
              {translationData.confidence && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {translationData.confidence} Confidence
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-white/90 mb-2 italic">&quot;{translationData.originalText}&quot;</p>
            <div className="w-full h-px bg-white/10 my-2"></div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 mb-2">English Translation</span>
            <p className="text-sm font-bold text-emerald-400">&quot;{translationData.translatedText}&quot;</p>
            <button 
              onClick={() => setTranslationData(null)}
              className="mt-4 text-xs text-muted-foreground hover:text-cyan-500 underline transition-colors"
            >
              Reset
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-white/70 mb-6">Click to speak a fan request</p>
            
            {/* Glowing Mic Button */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <button 
                aria-label="Start recording fan request"
                onClick={() => {
                  setIsListening(true);
                  
                  // Web Speech API Integration
                  try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const SpeechRecognition = (window as unknown as { SpeechRecognition: new () => any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: new () => any }).webkitSpeechRecognition;
                    if (SpeechRecognition) {
                      const recognition = new SpeechRecognition();
                      recognitionRef.current = recognition;
                      recognition.lang = 'es-ES'; // Listen for Spanish or default
                      recognition.interimResults = false;
                      recognition.maxAlternatives = 1;
                      
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      recognition.onresult = async (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        setIsListening(false);
                        setIsTranslating(true);
                        
                        try {
                          const res = await fetch(`${API_URL}/api/v1/copilot/translate`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text: transcript })
                          });
                          
                          if (!res.ok) throw new Error("Translation failed");
                          const data = await res.json();
                          setTranslationData(data);
                        } catch (err) {
                          console.error(err);
                          setTranslationData({
                            originalText: transcript,
                            translatedText: "API Error: Could not reach translation service.",
                            detectedLanguage: "Error"
                          });
                        } finally {
                          setIsTranslating(false);
                        }
                      };
                      
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      recognition.onerror = (event: any) => {
                        console.error('Speech recognition error', event.error);
                        setIsListening(false);
                        setTranslationData({
                          originalText: "",
                          translatedText: "Error accessing microphone.",
                          detectedLanguage: "Error"
                        });
                      };
                      
                      recognition.onnomatch = () => {
                        setIsListening(false);
                        setTranslationData({
                          originalText: "",
                          translatedText: "Could not understand audio.",
                          detectedLanguage: "Error"
                        });
                      };
                      
                      recognition.start();
                    } else {
                      setIsListening(false);
                      setTranslationData({
                          originalText: "",
                          translatedText: "Browser does not support Speech API.",
                          detectedLanguage: "Error"
                      });
                    }
                  } catch {
                    setIsListening(false);
                    setTranslationData({
                        originalText: "",
                        translatedText: "Microphone permission denied.",
                        detectedLanguage: "Error"
                    });
                  }
                }}
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-white/20"
              >
                <Mic size={24} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
