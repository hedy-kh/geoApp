import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

const correctSound = require('../../assets/Sound/correct.mp3');
const wrongSound = require('../../assets/Sound/wrong.mp3');
const win = require('../../assets/Sound/win.mp3');
const flip = require('../../assets/Sound/flip.mp3');

export default function useSound() {
  const correctPlayer = useAudioPlayer(correctSound);
  const wrongPlayer = useAudioPlayer(wrongSound);
  const flipPlayer = useAudioPlayer(flip);
  const winPlayer = useAudioPlayer(win);

  const correctAnswerSound = () => {
    if (!correctPlayer) return;
    correctPlayer.seekTo(0);
    correctPlayer.play();
  };

  const wrongAnswerSound = () => {
    if (!wrongPlayer) return;
    wrongPlayer.seekTo(0);
    wrongPlayer.play();
  };

  const flipSound = () => {
    if (!flipPlayer) return;
    flipPlayer.seekTo(2);
    flipPlayer.play();
  };

  const winSound = () => {
    if (!winPlayer) return;
    winPlayer.seekTo(0);
    winPlayer.play();
  };

  useEffect(() => {
    return () => {
      try {
        correctPlayer?.unload();
        wrongPlayer?.unload();
        flipPlayer?.unload();
        winPlayer?.unload();
      } catch (e) {
        // silent fail (safe)
      }
    };
  }, []);

  return {
    flipSound,
    winSound,
    correctAnswerSound,
    wrongAnswerSound,
  };
}