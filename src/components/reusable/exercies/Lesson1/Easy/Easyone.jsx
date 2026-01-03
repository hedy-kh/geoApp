import { View, Text } from 'react-native'
import React from 'react'
import useSound from '../../../../../hooks/useSound'
const Easyone = () => {
    const { winSound,correctAnswerSound,wrongAnswerSound, } = useSound();
  return (
    <View>
      <Text>Easyone</Text>
    </View>
  )
}

export default Easyone