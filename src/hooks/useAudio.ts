import { useCallback, useEffect, useRef } from 'react';
import { useProgressStore } from './useProgressStore';

export const useAudio = () => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);
  const { settings } = useProgressStore();

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
      }
    };

    if ('speechSynthesis' in window) {
      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        // Cleanup: cancel any ongoing speech on unmount
        speechSynthesis.cancel();
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const playPronunciation = useCallback((romaji: string, scriptType?: string) => {
    if (!settings.audioEnabled) {
      return;
    }
    // Use Web Speech API for pronunciation
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech to prevent overlaps
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(romaji);
      utteranceRef.current = utterance;
      
      // Try to use Japanese voice if available
      const voices = speechSynthesis.getVoices();
      const japaneseVoice = voices.find(voice => 
        voice.lang.includes('ja') || voice.name.includes('Japanese')
      );
      
      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      
      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        // Silent fallback - speech synthesis unavailable
        console.warn('Speech synthesis failed:', error);
      }
    }
  }, [settings.audioEnabled]);

  return { playPronunciation };
};
