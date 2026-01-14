// import { useEffect } from 'react';
// import { useAudioPlayer } from 'expo-audio';

// const correctSound = require('../../assets/Sound/correct.mp3');
// const wrongSound = require('../../assets/Sound/wrong.mp3');
// const win = require('../../assets/Sound/win.mp3');
// const flip = require('../../assets/Sound/flip.mp3');
// const arabic = require('../../assets/Sound/Arabic.mp3');
// const ali = require('../../assets/Sound/a7snat.mp3')
// export default function useSound() {
//   const correctPlayer = useAudioPlayer(correctSound);
//   const wrongPlayer = useAudioPlayer(wrongSound);
//   const flipPlayer = useAudioPlayer(flip);
//   const winPlayer = useAudioPlayer(win);
//   const ArabPlayer = useAudioPlayer(arabic);
//   const a7snatPlayer = useAudioPlayer(ali);

//   const correctAnswerSound = () => {
//     if (!correctPlayer) return;
//     correctPlayer.seekTo(0);
//     correctPlayer.play();
//   };

//   const wrongAnswerSound = () => {
//     if (!wrongPlayer) return;
//     wrongPlayer.seekTo(0);
//     wrongPlayer.play();
//   };

//   const flipSound = () => {
//     if (!flipPlayer) return;
//     flipPlayer.seekTo(2);
//     flipPlayer.play();
//   };

//   const winSound = () => {
//     if (!winPlayer) return;
//     winPlayer.seekTo(0);
//     winPlayer.play();
//   };
//   const arabicSound = () => {
//     if (!ArabPlayer) return;
//     ArabPlayer.seekTo(0);
//     ArabPlayer.play();
//   }
//   const arabSound = () => {
//     if (!a7snatPlayer) return;
//     a7snatPlayer.seekTo(0);
//     a7snatPlayer.play();
//   }

//   // useEffect(() => {
//   //   return () => {
//   //     try {
//   //       correctPlayer?.unload();
//   //       wrongPlayer?.unload();
//   //       flipPlayer?.unload();
//   //       winPlayer?.unload();
//   //       ArabPlayer?.unload();
//   //     } catch (e) {
//   //       // silent fail (safe)
//   //       console.log('error', e);
//   //     }
//   //   };
//   // }, []);

//   return {
//     flipSound,
//     winSound,
//     correctAnswerSound,
//     arabSound,
//     wrongAnswerSound,
//     arabicSound,
//   };
// }

import { useEffect } from "react";
import { useAudioPlayer } from "expo-audio";

const correctSound = require("../../assets/Sound/correct.mp3");
const wrongSound = require("../../assets/Sound/wrong.mp3");
const win = require("../../assets/Sound/win.mp3");
const flip = require("../../assets/Sound/flip.mp3");
const arabic = require("../../assets/Sound/Arabic.mp3");
const ali = require("../../assets/Sound/a7snat.mp3");

export default function useSound() {
  const correctPlayer = useAudioPlayer(correctSound);
  const wrongPlayer = useAudioPlayer(wrongSound);
  const flipPlayer = useAudioPlayer(flip);
  const winPlayer = useAudioPlayer(win);
  const ArabPlayer = useAudioPlayer(arabic);
  const a7snatPlayer = useAudioPlayer(ali);

  const correctAnswerSound = async () => {
    if (!correctPlayer) return;
    try {
      // If not loaded, replace/load it
      if (!correctPlayer.isLoaded) {
        await correctPlayer.replace(correctSound);
      }
      correctPlayer.seekTo(0);
      correctPlayer.play();
    } catch (error) {
      console.log("Error playing correct sound:", error);
    }
  };

  const wrongAnswerSound = async () => {
    if (!wrongPlayer) return;
    try {
      if (!wrongPlayer.isLoaded) {
        await wrongPlayer.replace(wrongSound);
      }
      wrongPlayer.seekTo(0);
      wrongPlayer.play();
    } catch (error) {
      console.log("Error playing wrong sound:", error);
    }
  };

  const flipSound = async () => {
    if (!flipPlayer) return;
    try {
      if (!flipPlayer.isLoaded) {
        await flipPlayer.replace(flip);
      }
      flipPlayer.seekTo(2);
      flipPlayer.play();
    } catch (error) {
      console.log("Error playing flip sound:", error);
    }
  };

  const winSound = async () => {
    if (!winPlayer) return;
    try {
      if (!winPlayer.isLoaded) {
        await winPlayer.replace(win);
      }
      winPlayer.seekTo(0);
      winPlayer.play();
    } catch (error) {
      console.log("Error playing win sound:", error);
    }
  };

  const arabicSound = async () => {
    if (!ArabPlayer) return;
    try {
      if (!ArabPlayer.isLoaded) {
        await ArabPlayer.replace(arabic);
      }
      ArabPlayer.seekTo(0);
      ArabPlayer.play();
    } catch (error) {
      console.log("Error playing arabic sound:", error);
    }
  };

  const arabSound = async () => {
    if (!a7snatPlayer) return;
    try {
      if (!a7snatPlayer.isLoaded) {
        await a7snatPlayer.replace(ali);
      }
      a7snatPlayer.seekTo(0);
      a7snatPlayer.play();
    } catch (error) {
      console.log("Error playing arab sound:", error);
    }
  };

  return {
    flipSound,
    winSound,
    correctAnswerSound,
    wrongAnswerSound,
    arabicSound,
    arabSound,
  };
}
