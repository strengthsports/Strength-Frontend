import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TextScallingFalse from '~/components/CentralText';

interface LocationSuggestionViewProps {
  addressPickup: string;
  handleAddressChange: (text: string) => void;
  handlePlaceSelect: (place: any) => void;
  predictions: any[];
  setShowSuggestions: (show: boolean) => void;
}

const LocationSuggestionView: React.FC<LocationSuggestionViewProps> = ({
  addressPickup,
  handleAddressChange,
  handlePlaceSelect,
  predictions,
  setShowSuggestions,
}) => {
  return (
    <View className="absolute top-0 left-0 w-full h-full bg-black z-50">
      <View className="flex-row items-center p-4 border-b border-[#515151]">
        <TouchableOpacity onPress={() => setShowSuggestions(false)} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          value={addressPickup}
          onChangeText={handleAddressChange}
          placeholder="Search location"
          placeholderTextColor="#666"
          className="flex-1 text-white"
          autoFocus
        />
        {addressPickup.length > 0 && (
          <TouchableOpacity onPress={() => handleAddressChange('')}>
            <MaterialIcons name="clear" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView className="flex-1">
        {predictions.map((place) => (
          <TouchableOpacity
            key={place.place_id}
            onPress={() => handlePlaceSelect(place)}
            className="p-4 border-b border-[#515151]"
          >
            <View className="flex-row items-center">
              <MaterialIcons name="location-on" size={20} color="gray" className="mr-2" />
              <TextScallingFalse className="text-white">{place.description}</TextScallingFalse>
            </View>
          </TouchableOpacity>
        ))}
        
        {predictions.length === 0 && (
          <View className="p-4">
            <TextScallingFalse className="text-gray-400 text-center">
              No locations found. Try a different search.
            </TextScallingFalse>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LocationSuggestionView;