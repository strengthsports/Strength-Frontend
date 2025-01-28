import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import React, { memo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Divider } from 'react-native-elements'

const MoreModal = memo(({firstName} : {firstName : string}) => {
    return(
    <View className="h-80 w-full bg-neutral-900 rounded-t-3xl p-4">
    <Divider
      className="w-16 self-center rounded-full bg-neutral-700 my-1"
      width={4}
    />
    <View className="flex-1 justify-evenly">
      <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
        <MaterialIcons
          name="bookmark-border"
          size={24}
          color="white"
        />
        <Text className="text-white ml-4">Bookmark</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
        <FontAwesome name="share" size={20} color="white" />
        <Text className="text-white ml-4">Share</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
        <MaterialIcons
          name="report-problem"
          size={22}
          color="white"
        />
        <Text className="text-white ml-4">Report</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center py-3 px-2 active:bg-neutral-800 rounded-lg">
        <FontAwesome name="user-plus" size={19} color="white" />
        <Text className="text-white ml-4">
          Follow {firstName}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
  )})

  export default MoreModal