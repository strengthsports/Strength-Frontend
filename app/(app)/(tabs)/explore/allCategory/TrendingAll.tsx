import React from 'react'
import { View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import TextScallingFalse from '~/components/CentralText';

export default function TrendingAll() {
  return (

          <View className='flex items-center my-12 '>
              <TextScallingFalse className="text-white " >All Trending Here</TextScallingFalse>
          </View>
  )
}
