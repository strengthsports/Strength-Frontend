import React from 'react'
import { View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import TextScallingFalse from '~/components/CentralText';
// import { ExploreSportsCategoryHeader } from '~/components/explorePage/exploreHeader';

export default function TrendingNews() {
  return (

          <View className='flex items-center my-12 '>
                  {/* <ExploreSportsCategoryHeader /> */}
            
              <TextScallingFalse className="text-white " >News Trending Here</TextScallingFalse>
          </View>
  )
}
