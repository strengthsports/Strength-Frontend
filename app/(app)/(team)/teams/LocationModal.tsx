import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Vibration, ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";
import debounce from "lodash/debounce";
import TextScallingFalse from "~/components/CentralText";
import useGetAddress from "./useGetAddress";
import { vibrationPattern } from "~/constants/vibrationPattern";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API;

const LocationModal = ({ visible, onClose, onSave }) => {
  const [addressPickup, setAddressPickup] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const isAndroid = Platform.OS === "android";

  const { loading, error, address, getAddress } = useGetAddress();

  // Feedback function for errors and success messages
  const feedback = (message, type = "error") => {
    if (type === "error") {
      Vibration.vibrate(vibrationPattern);
      isAndroid
        ? ToastAndroid.show(message, ToastAndroid.SHORT)
        : Toast.show({
            type,
            text1: message,
            visibilityTime: 3000,
            autoHide: true,
          });
    } else {
      Toast.show({
        type,
        text1: message,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  // Debounced function for getting place predictions
  const getPlacePredictions = useRef(
    debounce(async (text) => {
      if (!text) {
        setPredictions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            text
          )}&key=${apiKey}&components=country:in`
        );
        const data = await response.json();
        if (data.status === "OK") {
          setPredictions(data.predictions);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.error("Error fetching place predictions:", error);
        setPredictions([]);
      }
    }, 300)
  );

  // Handle text input changes
  const handleAddressChange = (text) => {
    setAddressPickup(text);
    setShowSuggestions(true);
    getPlacePredictions.current(text);
  };

  // Handle place selection from suggestions
  const handlePlaceSelect = async (place) => {
    try {
      setShowSuggestions(false);
      setAddressPickup(place.description);
      setPredictions([]);

      // Get place details
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const result = data.result;
        const location = result.geometry.location;
        const addressComponents = result.address_components || [];

        const getComponent = (type) => {
          return (
            addressComponents.find((c) => c.types.includes(type))?.long_name ||
            ""
          );
        };

        const city =
          getComponent("locality") ||
          getComponent("administrative_area_level_2") ||
          getComponent("postal_town") ||
          "Unknown City";
        const state =
          getComponent("administrative_area_level_1") || "Unknown State";
        const country = getComponent("country") || "Unknown Country";

        const addressData = {
          city,
          state,
          country,
          coordinates: [location.lng, location.lat],
          formattedAddress: place.description,
        };

        setSelectedPlace(addressData);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      feedback("Failed to get place details", "error");
    }
  };

  // Sync address with local state when using current location
  useEffect(() => {
    if (address) {
      setAddressPickup(address.formattedAddress);
      setSelectedPlace(address);
    }
  }, [address]);

  // Handle error changes
  useEffect(() => {
    if (error) {
      feedback(error);
    }
  }, [error]);

  const handleSaveLocation = () => {
    if (!selectedPlace) {
      feedback("Please select a valid location", "error");
      return;
    }
    onSave(selectedPlace);
    feedback("Location successfully set", "success");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/95 justify-center">
        <View className="bg-black border border-[#515151] rounded-lg mx-4 my-8 p-4 h-4/5">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <TextScallingFalse className="text-white text-2xl font-bold">
              Set Location
            </TextScallingFalse>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View className="mb-4">
            <TextScallingFalse className="text-white mb-2">
              Enter location
            </TextScallingFalse>
            <TextInput
              value={addressPickup}
              onChangeText={handleAddressChange}
              placeholder="Search location"
              placeholderTextColor="#666"
              className="bg-transparent border border-[#515151] rounded-lg p-4 text-white"
              onFocus={() => setShowSuggestions(true)}
            />
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setShowSuggestions(false);
              getAddress();
            }}
            className="bg-transparent border border-[#515151] rounded-full h-12 flex-row items-center justify-center mb-4"
          >
            {loading ? (
              <>
                <TextScallingFalse className="text-gray-400 mr-2">
                  Fetching location...
                </TextScallingFalse>
                <ActivityIndicator size="small" color="gray" />
              </>
            ) : (
              <>
                <TextScallingFalse className="text-gray-400 mr-2">
                  Use my current location
                </TextScallingFalse>
                <MaterialIcons name="location-pin" size={20} color="gray" />
              </>
            )}
          </TouchableOpacity>

          {/* Suggestions List */}
          {showSuggestions && predictions.length > 0 && (
            <View className="flex-1 border border-[#515151] rounded-lg mb-4">
              <ScrollView>
                {predictions.map((place) => (
                  <TouchableOpacity
                    key={place.place_id}
                    onPress={() => handlePlaceSelect(place)}
                    className="p-3 border-b border-[#515151]"
                  >
                    <TextScallingFalse className="text-white">
                      {place.description}
                    </TextScallingFalse>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Selected Location Display */}
          {selectedPlace && (
            <View className="bg-gray-900 rounded-lg p-4 mb-4">
              <TextScallingFalse className="text-white font-bold mb-2">
                Selected Location:
              </TextScallingFalse>
              <TextScallingFalse className="text-gray-300">
                {selectedPlace.formattedAddress || 
                  `${selectedPlace.city}, ${selectedPlace.state}, ${selectedPlace.country}`}
              </TextScallingFalse>
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSaveLocation}
            className="bg-[#12956B] rounded-lg p-4 items-center"
          >
            <TextScallingFalse className="text-white text-lg font-semibold">
              Save Location
            </TextScallingFalse>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LocationModal;