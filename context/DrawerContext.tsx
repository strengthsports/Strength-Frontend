// DrawerContext.tsx
import React, {
  createContext,
  useContext,
  useRef,
  ReactNode,
  useState,
} from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import CustomDrawer, { DrawerRefProps } from "~/components/ui/CustomDrawer";
import nopic from "@/assets/images/nopic.jpg";

interface DrawerContextProps {
  handleOpenDrawer: () => void;
  handleCloseDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextProps>({
  handleOpenDrawer: () => {},
  handleCloseDrawer: () => {},
});

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const drawerRef = useRef<DrawerRefProps>(null);

  const handleOpenDrawer = () => {
    drawerRef.current?.open();
  };

  const handleCloseDrawer = () => {
    drawerRef.current?.close();
  };

  // For demonstration, we’re using dummy data.
  //   In a real-world scenario, you might pull this from redux, props, or other contexts.
  const user = {
    profilePic: null,
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
  };

  const teamDetails: any[] = [
    // Example team object:
    // { id: 1, name: "Team One", url: "https://example.com/team-one.png" }
  ];

  // Dummy implementations; replace these with your actual logic
  const handleLogout = () => console.log("Logout");
  const router = { push: (url: string) => console.log("Navigating to", url) };

  return (
    <DrawerContext.Provider value={{ handleOpenDrawer, handleCloseDrawer }}>
      {/* Render the drawer with your desired content */}
      <CustomDrawer ref={drawerRef} onClose={handleCloseDrawer}>
        <View
          className="w-full h-full bg-black pt-6"
          onStartShouldSetResponder={() => true}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleCloseDrawer}
            className="absolute top-4 right-4"
          >
            <Ionicons name="close" size={25} color="white" />
          </TouchableOpacity>

          {/* Sidebar Content */}
          <View className="flex-1 pt-12">
            {/* Profile Section */}
            <View className="flex-row items-center justify-start pl-6 space-x-4 mb-6">
              <Image
                source={user?.profilePic ? { uri: user?.profilePic } : nopic} // replace with user?.profilePic or defaultPic
                className="w-14 h-14 rounded-full"
                resizeMode="cover"
              />
              <View className="pl-4">
                <Text className="text-white text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-gray-400 text-lg">@{user?.username}</Text>
              </View>
            </View>

            {/* <CustomDivider
                color="#5C5C5C"
                thickness={0.2}
                style={{ marginHorizontal: "auto", width: "90%", opacity: 0.5 }}
              /> */}

            {/* Teams section */}
            <View className="mt-2 w-[90%] mx-auto">
              <Text className="text-white text-4xl font-bold">
                Manage Teams
              </Text>

              {teamDetails.map((team: any, index: any) => (
                <View
                  className={
                    index === teamDetails.length - 1 ? "mb-4 mx-2" : "mb-2 mx-2"
                  }
                  key={index}
                >
                  {/* Replace teamDetails mapping with your data */}
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      router.push(`../(team)/teams/${team.id}`);
                      handleCloseDrawer();
                    }}
                  >
                    <View className="flex-row items-center mt-4">
                      <Image
                        source={{ uri: team.url }}
                        className="w-10 h-10 rounded-full"
                        resizeMode="cover"
                      />
                      <Text className="text-white text-3xl font-medium ml-4">
                        {team.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}

              <View className="flex-row mb-4 px-3">
                {/* Create Team Button */}
                <View className="border border-[#12956B] px-3 py-1 rounded-md flex-row items-center">
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/(app)/(team)/teams/InitiateCreateTeam");
                      handleCloseDrawer();
                    }}
                  >
                    <Text className="text-[#12956B] text-base font-semibold">
                      Create Team
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    className="ml-1"
                    name="plus"
                    size={10}
                    color="#12956B"
                  />
                </View>

                {/* Join Team Button */}
                <TouchableOpacity
                  onPress={() => {
                    // your join team logic here
                  }}
                  className="ml-4"
                >
                  <View className="bg-[#12956B] px-4 py-2 rounded-md items-center">
                    <Text className="text-white text-base font-semibold">
                      Join Team
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* <CustomDivider
                  color="#5C5C5C"
                  thickness={0.2}
                  style={{
                    marginHorizontal: "auto",
                    width: "100%",
                    opacity: 0.5,
                  }}
                /> */}
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="mb-2 w-[90%] mx-auto"
            >
              <Text className="text-white text-4xl font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* <CustomDivider
              color="#5C5C5C"
              thickness={0.2}
              style={{ marginHorizontal: "auto", width: "90%", opacity: 0.5 }}
            /> */}

          <View className="pb-24 w-[90%] mx-auto">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                router.push("/(app)/(settings)/settings");
                handleCloseDrawer();
              }}
            >
              <Feather
                name="settings"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white text-4xl font-medium">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomDrawer>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(DrawerContext);
