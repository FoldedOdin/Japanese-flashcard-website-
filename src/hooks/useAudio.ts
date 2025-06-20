import { useCallback } from 'react';

export const useAudio = () => {
  const playPronunciation = useCallback((romaji: string) => {
    // Use Web Speech API for pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(romaji);
      
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
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  return { playPronunciation };
};