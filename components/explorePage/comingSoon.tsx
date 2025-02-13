import React from 'react'
import { View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import TextScallingFalse from '~/components/CentralText';

export default function ComingSoon({text} : {text: string}) {
  return (

          <View className='flex items-center my-12 '>
            <LinearGradient
              colors={["#12956B", "#000"]}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: "#181818",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#12956B",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 1,
                shadowRadius: 20,
                elevation: 20,
              }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.45 }}
            >
              <TextScallingFalse className="text-white text-center" >{text} section is coming soon</TextScallingFalse>
            </LinearGradient>
          </View>
  )
}
