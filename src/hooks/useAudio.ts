import { useCallback, useEffect, useRef } from 'react';
import { useProgressStore } from './useProgressStore';

export const useAudio = () => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);
  const { state } = useProgressStore();
  const audioEnabled = state?.settings?.audioEnabled ?? true;

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

  const playPronunciation = useCallback((romaji: string, _scriptType?: string) => {
    if (!audioEnabled) {
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
  }, [audioEnabled]);

  const playSuccessSound = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio context might be restricted
    }
  }, [audioEnabled]);

  const playErrorSound = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio context might be restricted
    }
  }, [audioEnabled]);

  return { playPronunciation, playSuccessSound, playErrorSound };
};
