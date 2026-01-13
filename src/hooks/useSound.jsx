import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

const correctSound = require('../../assets/Sound/correct.mp3');
const wrongSound = require('../../assets/Sound/wrong.mp3');
const win = require('../../assets/Sound/win.mp3');
const flip = require('../../assets/Sound/flip.mp3');
const arabic = require('../../assets/Sound/Arabic.mp3');
export default function useSound() {
  const correctPlayer = useAudioPlayer(correctSound);
  const wrongPlayer = useAudioPlayer(wrongSound);
  const flipPlayer = useAudioPlayer(flip);
  const winPlayer = useAudioPlayer(win);
  const ArabPlayer = useAudioPlayer(arabic);

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
  const arabicSound = () => {
    if (!ArabPlayer) return;
    ArabPlayer.seekTo(0);
    ArabPlayer.play();
  }

  // useEffect(() => {
  //   return () => {
  //     try {
  //       correctPlayer?.unload();
  //       wrongPlayer?.unload();
  //       flipPlayer?.unload();
  //       winPlayer?.unload();
  //       ArabPlayer?.unload();        
  //     } catch (e) {
  //       // silent fail (safe)
  //       console.log('error', e);
  //     }
  //   };
  // }, []);

  return {
    flipSound,
    winSound,
    correctAnswerSound,
    wrongAnswerSound,
    arabicSound,
  };
}