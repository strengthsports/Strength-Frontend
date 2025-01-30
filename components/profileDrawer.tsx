import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { logoutUser } from "~/reduxStore/slices/user/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/reduxStore";
import Toast from "react-native-toast-message";
import { ToastAndroid } from "react-native";

// Define types for the props
interface ProfileDrawerProps {
  onClose: () => void; // onClose is a function that returns nothing
}

// Get the height of the screen
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    const isAndroid = Platform.OS == "android";
    try {
      const response = await dispatch(logoutUser()).unwrap();
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    } catch (err) {
      console.error("Logout failed:", err);
      isAndroid
        ? ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT)
        : Toast.show({
            type: "error",
            text1: "Logged out successfully",
            visibilityTime: 1500,
            autoHide: true,
          });
    }
  };

  return (
    <View
      className="absolute top-0 left-0 bg-black  z-50 w-[250px] pl-3"
      style={{ height }} // Use dynamic height here
    >
      <View className="flex flex-row justify-end px-6">
        <TouchableOpacity onPress={onClose}>
          <Icon name="cross" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex flex-col items-start px-6 py-4">
        {/* Profile Picture and Details */}
        <View className="flex flex-row items-center">
          {/* Profile Image */}
          <View className="w-16 h-16 mr-4">
            <Image
              source={require("../assets/images/nopic.jpg")}
              className="w-full h-full rounded-full"
            />
          </View>

          {/* Profile Name and Handle */}
          <View>
            <Text className="text-white text-2xl font-semibold">John Doe</Text>
            <Text className="text-white text-lg">@johndoe</Text>
          </View>
        </View>
      </View>

      {/* Profile Details */}
      <View>
        <View className="flex flex-col items-start border-t border-b border-gray-600 py-4 px-6">
          <Text className="text-white text-4xl font-semibold mb-4">
            Manage Teams
          </Text>

          <View className="flex flex-row justify-start mt-8">
            <TouchableOpacity className="border border-[#12956B] p-3 rounded-md w-[48%] mr-1">
              <Text className="text-[#12956B] text-center text-lg">
                Create Team
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#12956B] p-3 rounded-md w-[48%] ml-1">
              <Text className="text-white text-center text-lg">Join Team</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row items-center  border-b border-gray-600 py-4 px-6">
          <Text className="text-white text-4xl ">Add in Squad</Text>
        </View>

        <View className="flex flex-row items-center border-b border-gray-600 py-4 px-6">
          <Text className="text-white text-4xl ">Add Members</Text>
        </View>
        <View className="flex flex-row items-center border-b border-gray-600 py-4 px-6">
          <TouchableOpacity onPress={handleLogout}>
            <Text className="text-white text-4xl ">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*setting*/}
      <View className="absolute bottom-20 left-0 right-0 px-6  border-t border-gray-600">
        <TouchableOpacity
          onPress={() => console.log("Settings")}
          className="flex flex-row items-center py-3"
        >
          <Icon name="cog" size={25} color="white" />
          <Text className="text-white text-5xl ml-2">Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileDrawer;
