import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, Modal } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { UseSelector, useDispatch } from "react-redux";
import useGetAddress from "~/hooks/useGetAddress";
import { setAddress } from "~/reduxStore/slices/user/onboardingSlice";

type LocationModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: any;
};

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("Kolkata, West Bengal");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
  const [state, setState] = useState("West Bengal");
  const dispatch = useDispatch();
  const { loading, error, address, getAddress } = useGetAddress();

  const setAddress = async () => {
    try {
      await getAddress();
      if (address) {
        setCountry(address.country);
        setCity(`${address.city}, ${address.state}`);
        setFormattedAddress(address.formattedAddress);
        setCoordinates(address.coordinates);

        console.log("Country:", address.country);
        console.log("City:", address.city);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDone = () => {
    // Call the onSave callback with the location data
    onSave({ country, city, formattedAddress, coordinates,state });
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <SafeAreaView className="flex-1 bg-black">
        {/* Header */}
        <View className="flex flex-row items-center justify-between px-5 py-4">
          {/* Close Button */}
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-white text-5xl font-semibold">Location</Text>

          {/* Done Button */}
          <TouchableOpacity onPress={handleDone}>
            <Text className="text-[#12956B] text-4xl font-semibold">Done</Text>
          </TouchableOpacity>
        </View>

        {/* Location Selection */}
        <View className="px-8 mt-6">
          {/* Country Input */}
          <Text className="text-white/60 text-3xl">Country/Region*</Text>
          <TextInput
            value={country}
            onChangeText={setCountry}
            placeholder="Enter Country"
            placeholderTextColor="#5C5C5C"
            className="border border-[#222020] mt-2 py-4 px-4 text-white text-3xl rounded-lg"
          />

          {/* City Input */}
          <Text className="text-white/60 text-3xl mt-6">City-State*</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Enter City"
            placeholderTextColor="#5C5C5C"
            className="border border-[#222020] mt-2 py-4 px-4 text-white text-3xl rounded-lg"
          />
        </View>

        {/* Current Location Button */}
        <View className="flex items-center mt-8">
          <TouchableOpacity onPress={setAddress}>
            <Text className="text-[#12956B] text-4xl font-semibold">
              Use Current Location
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LocationModal;
